from __future__ import annotations

import csv
import io
from collections import Counter
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable

VALID_CATEGORIES = (
    "TECHNICAL",
    "BILLING",
    "ACCESS",
    "HR_QUERY",
    "COMPLAINT",
)

VALID_STATUSES = (
    "OPEN",
    "CLOSED",
    "DISCARDED",
)

INVALID_RULE_LABELS = (
    ("missing_client_company", "Missing client_company"),
    ("invalid_category", "Invalid or missing category"),
    ("invalid_description", "Missing or short description"),
    ("invalid_agent_id", "Invalid or missing agent_id"),
    ("invalid_status", "Invalid or missing status"),
    ("invalid_email", "Invalid or missing email"),
    ("closed_without_score", "Closed ticket, no score"),
    ("score_out_of_range", "Score out of range"),
)

SCORE_LABELS = {
    1: "Very dissatisfied",
    2: "Dissatisfied",
    3: "Neutral",
    4: "Satisfied",
    5: "Very satisfied",
}

REQUIRED_FIELDS = (
    "ticket_id",
    "date",
    "client_company",
    "category",
    "description",
    "agent_id",
    "status",
    "customer_email",
    "satisfaction_score",
)


@dataclass
class AnalysisResult:
    total_records: int
    valid_records: int
    invalid_records: int
    invalid_breakdown: Counter[str]
    category_counts: Counter[str]
    status_counts: Counter[str]
    satisfaction_counts: Counter[int]
    closed_valid_records: int

    @property
    def average_score(self) -> float:
        scored_tickets = sum(self.satisfaction_counts.values())
        if scored_tickets == 0:
            return 0.0

        weighted_sum = sum(score * count for score, count in self.satisfaction_counts.items())
        return weighted_sum / scored_tickets


class InvalidCsvFormatError(ValueError):
    pass


def normalize(value: str | None) -> str:
    return (value or "").strip()


def is_valid_agent_id(agent_id: str) -> bool:
    return len(agent_id) == 6 and agent_id.startswith("AGT-") and agent_id[4:].isdigit()


def is_valid_email(email: str) -> bool:
    return "@" in email and len(email) >= 3


def parse_score(raw_score: str) -> int | None:
    if raw_score == "":
        return None

    try:
        return int(raw_score)
    except ValueError:
        return None


def validate_record(record: dict[str, str]) -> tuple[bool, list[str], int | None]:
    reasons: list[str] = []

    client_company = normalize(record.get("client_company"))
    category = normalize(record.get("category"))
    description = normalize(record.get("description"))
    agent_id = normalize(record.get("agent_id"))
    status = normalize(record.get("status"))
    customer_email = normalize(record.get("customer_email"))
    raw_score = normalize(record.get("satisfaction_score"))
    parsed_score = parse_score(raw_score)

    if not client_company:
        reasons.append("missing_client_company")

    if category not in VALID_CATEGORIES:
        reasons.append("invalid_category")

    if len(description) < 5:
        reasons.append("invalid_description")

    if not is_valid_agent_id(agent_id):
        reasons.append("invalid_agent_id")

    if status not in VALID_STATUSES:
        reasons.append("invalid_status")

    if not is_valid_email(customer_email):
        reasons.append("invalid_email")

    if status == "CLOSED" and raw_score == "":
        reasons.append("closed_without_score")

    if raw_score != "":
        if parsed_score is None or parsed_score < 1 or parsed_score > 5:
            reasons.append("score_out_of_range")

    return (len(reasons) == 0, reasons, parsed_score)


def percentage(count: int, total: int) -> float:
    if total == 0:
        return 0.0
    return (count / total) * 100


def analyze_records(records: Iterable[dict[str, str]]) -> AnalysisResult:
    total_records = 0
    valid_records = 0
    invalid_breakdown: Counter[str] = Counter()
    category_counts: Counter[str] = Counter()
    status_counts: Counter[str] = Counter()
    satisfaction_counts: Counter[int] = Counter()
    closed_valid_records = 0

    for record in records:
        total_records += 1
        is_valid, reasons, parsed_score = validate_record(record)

        if not is_valid:
            invalid_breakdown.update(reasons)
            continue

        valid_records += 1

        category = normalize(record.get("category"))
        status = normalize(record.get("status"))
        category_counts[category] += 1
        status_counts[status] += 1

        if status == "CLOSED":
            closed_valid_records += 1
            if parsed_score is not None:
                satisfaction_counts[parsed_score] += 1

    return AnalysisResult(
        total_records=total_records,
        valid_records=valid_records,
        invalid_records=total_records - valid_records,
        invalid_breakdown=invalid_breakdown,
        category_counts=category_counts,
        status_counts=status_counts,
        satisfaction_counts=satisfaction_counts,
        closed_valid_records=closed_valid_records,
    )


def _validate_required_headers(reader: csv.DictReader[str]) -> None:
    if not reader.fieldnames:
        raise InvalidCsvFormatError("CSV file is missing a header row.")

    missing_headers = [field for field in REQUIRED_FIELDS if field not in reader.fieldnames]
    if missing_headers:
        joined = ", ".join(missing_headers)
        raise InvalidCsvFormatError(f"CSV file is missing required columns: {joined}")


def analyze_csv_file(csv_path: Path) -> AnalysisResult:
    with csv_path.open("r", encoding="utf-8", newline="") as csv_file:
        reader = csv.DictReader(csv_file)
        _validate_required_headers(reader)
        return analyze_records(reader)


def analyze_csv_bytes(csv_bytes: bytes) -> AnalysisResult:
    text_stream = io.StringIO(csv_bytes.decode("utf-8"))
    reader = csv.DictReader(text_stream)
    _validate_required_headers(reader)
    return analyze_records(reader)


def metric_rows(result: AnalysisResult) -> Iterable[list[str]]:
    yield ["metric", "value", "percentage", "notes"]
    yield ["total_records", str(result.total_records), "", ""]
    yield ["valid_records", str(result.valid_records), "", ""]
    yield ["invalid_records", str(result.invalid_records), "", ""]

    for rule_key, rule_label in INVALID_RULE_LABELS:
        yield [
            f"invalid:{rule_key}",
            str(result.invalid_breakdown.get(rule_key, 0)),
            "",
            rule_label,
        ]

    for category in VALID_CATEGORIES:
        count = result.category_counts.get(category, 0)
        yield [
            f"category:{category}",
            str(count),
            f"{percentage(count, result.valid_records):.1f}",
            "valid records",
        ]

    for status in VALID_STATUSES:
        count = result.status_counts.get(status, 0)
        yield [
            f"status:{status}",
            str(count),
            f"{percentage(count, result.valid_records):.1f}",
            "valid records",
        ]

    yield ["closed_scored_tickets", str(sum(result.satisfaction_counts.values())), "", ""]
    yield ["closed_valid_records", str(result.closed_valid_records), "", ""]
    yield ["average_satisfaction_score", f"{result.average_score:.2f}", "", "out of 5.00"]

    for score in range(1, 6):
        yield [
            f"satisfaction_score:{score}",
            str(result.satisfaction_counts.get(score, 0)),
            "",
            SCORE_LABELS[score],
        ]


def result_to_summary_dict(result: AnalysisResult) -> dict[str, object]:
    scored_tickets = sum(result.satisfaction_counts.values())
    return {
        "totals": {
            "records": result.total_records,
            "valid": result.valid_records,
            "invalid": result.invalid_records,
        },
        "invalid_breakdown": {
            rule_key: result.invalid_breakdown.get(rule_key, 0)
            for rule_key, _ in INVALID_RULE_LABELS
        },
        "categories": {
            category: {
                "count": result.category_counts.get(category, 0),
                "percentage": round(percentage(result.category_counts.get(category, 0), result.valid_records), 1),
            }
            for category in VALID_CATEGORIES
        },
        "statuses": {
            status: {
                "count": result.status_counts.get(status, 0),
                "percentage": round(percentage(result.status_counts.get(status, 0), result.valid_records), 1),
            }
            for status in VALID_STATUSES
        },
        "satisfaction": {
            "scored_tickets": scored_tickets,
            "closed_valid_records": result.closed_valid_records,
            "average": round(result.average_score, 2),
            "distribution": {
                str(score): result.satisfaction_counts.get(score, 0)
                for score in range(1, 6)
            },
        },
    }


def export_result_to_csv_bytes(result: AnalysisResult) -> bytes:
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerows(metric_rows(result))
    return output.getvalue().encode("utf-8")
