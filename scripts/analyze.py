from __future__ import annotations

import csv
import sys
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


def analyze_csv(csv_path: Path) -> AnalysisResult:
	total_records = 0
	valid_records = 0
	invalid_breakdown: Counter[str] = Counter()
	category_counts: Counter[str] = Counter()
	status_counts: Counter[str] = Counter()
	satisfaction_counts: Counter[int] = Counter()
	closed_valid_records = 0

	with csv_path.open("r", encoding="utf-8", newline="") as csv_file:
		reader = csv.DictReader(csv_file)
		for record in reader:
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


def percentage(count: int, total: int) -> float:
	if total == 0:
		return 0.0
	return (count / total) * 100


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


def export_results(result: AnalysisResult, output_path: Path) -> None:
	with output_path.open("w", encoding="utf-8", newline="") as csv_file:
		writer = csv.writer(csv_file)
		writer.writerows(metric_rows(result))


def print_summary(result: AnalysisResult, source_name: str) -> None:
	print("=" * 60)
	print("  NEXOVA - SUPPORT TICKET ANALYSIS")
	print(f"  Source file: {source_name}")
	print("=" * 60)
	print()
	print(f"TOTAL RECORDS IN FILE .......... {result.total_records}")
	print(f"  |- Valid records ................ {result.valid_records}")
	print(f"  '- Invalid / incomplete .......... {result.invalid_records}")
	print()
	print("INVALID RECORDS BREAKDOWN")

	invalid_entries = [
		(rule_key, label)
		for rule_key, label in INVALID_RULE_LABELS
		if result.invalid_breakdown.get(rule_key, 0) > 0
	]

	if invalid_entries:
		for index, (rule_key, label) in enumerate(invalid_entries):
			branch = "  '-" if index == len(invalid_entries) - 1 else "  |-"
			print(f"{branch} {label:<30} {result.invalid_breakdown[rule_key]}")
	else:
		print("  '- None .......................... 0")

	print()
	print("BREAKDOWN BY CATEGORY (valid records)")
	for index, category in enumerate(VALID_CATEGORIES):
		count = result.category_counts.get(category, 0)
		branch = "  '-" if index == len(VALID_CATEGORIES) - 1 else "  |-"
		print(
			f"{branch} {category:<28} {count:>2}  ({percentage(count, result.valid_records):.1f}%)"
		)

	print()
	print("BREAKDOWN BY STATUS (valid records)")
	for index, status in enumerate(VALID_STATUSES):
		count = result.status_counts.get(status, 0)
		branch = "  '-" if index == len(VALID_STATUSES) - 1 else "  |-"
		print(
			f"{branch} {status:<28} {count:>2}  ({percentage(count, result.valid_records):.1f}%)"
		)

	print()
	print("SATISFACTION INDEX (closed tickets)")
	print(
		f"  Scored tickets: {sum(result.satisfaction_counts.values())} of {result.closed_valid_records}"
	)
	print(f"  Average score: {result.average_score:.2f} / 5.00")
	for score in range(1, 6):
		branch = "  '-" if score == 5 else "  |-"
		score_label = f"Score {score} ({SCORE_LABELS[score]})"
		print(
			f"{branch} {score_label:<33} {result.satisfaction_counts.get(score, 0):>2}"
		)

	print()
	print("=" * 60)


def main() -> int:
	if len(sys.argv) != 2:
		print("Usage: python analyze.py <path-to-incidents.csv>", file=sys.stderr)
		return 1

	csv_path = Path(sys.argv[1]).expanduser()
	if not csv_path.is_absolute():
		csv_path = Path.cwd() / csv_path

	if not csv_path.exists() or not csv_path.is_file():
		print(f"Error: file not found: {csv_path}", file=sys.stderr)
		return 1

	try:
		result = analyze_csv(csv_path)
	except OSError as error:
		print(f"Error reading file: {error}", file=sys.stderr)
		return 1

	print_summary(result, csv_path.name)
	export_choice = input("Export results to CSV? [y / n]: ").strip().lower()

	if export_choice == "y":
		output_path = Path.cwd() / "results.csv"
		export_results(result, output_path)
		print(f"Results exported to {output_path.name}")

	return 0


if __name__ == "__main__":
	raise SystemExit(main())
