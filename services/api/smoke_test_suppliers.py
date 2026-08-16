from __future__ import annotations

from fastapi.testclient import TestClient

from main import app


# Smoke test simple para validar el flujo crítico de Supplier Directory.
def run_smoke_test() -> None:
    client = TestClient(app)

    results: list[tuple[str, bool, str]] = []

    response = client.get("/suppliers")
    results.append(("GET /suppliers", response.status_code == 200, f"status={response.status_code}"))

    invalid_payload = {
        "name": "Invalid Supplier",
        "country": "Spain",
        "categories": ["job_boards"],
        "monthly_rate": -20,
        "currency": "EUR",
        "status": "active",
    }
    response = client.post("/suppliers", json=invalid_payload)
    results.append(("POST invalid payload", response.status_code == 422, f"status={response.status_code}"))

    valid_payload = {
        "name": "Smoke Test Supplier",
        "country": "USA",
        "categories": ["ats_software"],
        "monthly_rate": 199.99,
        "currency": "USD",
        "status": "active",
        "contact_email": "smoke@test.com",
    }
    response = client.post("/suppliers", json=valid_payload)
    created_ok = response.status_code == 201
    supplier_id = response.json().get("id") if created_ok else None
    results.append(("POST valid payload", created_ok, f"status={response.status_code}"))

    if supplier_id is None:
        _print_results(results)
        raise SystemExit(1)

    response = client.patch(f"/suppliers/{supplier_id}/rate", json={"monthly_rate": 250.0})
    results.append(("PATCH /suppliers/{id}/rate", response.status_code == 200, f"status={response.status_code}"))

    response = client.patch(f"/suppliers/{supplier_id}/status", json={"status": "suspended"})
    status_ok = response.status_code == 200 and response.json().get("status") == "suspended"
    results.append(("PATCH /suppliers/{id}/status", status_ok, f"status={response.status_code}"))

    response = client.get("/suppliers", params={"country": "USA"})
    results.append(("GET /suppliers?country=USA", response.status_code == 200, f"status={response.status_code}"))

    response = client.get("/suppliers", params={"category": "ats_software"})
    results.append(("GET /suppliers?category=ats_software", response.status_code == 200, f"status={response.status_code}"))

    response = client.delete(f"/suppliers/{supplier_id}")
    results.append(("DELETE /suppliers/{id}", response.status_code == 200, f"status={response.status_code}"))

    response = client.get(f"/suppliers/{supplier_id}")
    results.append(("GET deleted supplier", response.status_code == 404, f"status={response.status_code}"))

    _print_results(results)

    failed = [name for name, ok, _ in results if not ok]
    if failed:
        raise SystemExit(1)


def _print_results(results: list[tuple[str, bool, str]]) -> None:
    print("\nSupplier API smoke test results:")
    for name, ok, detail in results:
        mark = "PASS" if ok else "FAIL"
        print(f"- {mark} | {name} | {detail}")


if __name__ == "__main__":
    run_smoke_test()
