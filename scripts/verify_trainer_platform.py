import os
import sys
import uuid
from fastapi.testclient import TestClient

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.main import app
from app.core.database import SessionLocal
from app.models.user import AppUser

def verify_trainer_endpoints():
    print("=" * 70)
    print("SANKHYAI Trainer Platform - Backend Endpoint Verification")
    print("=" * 70)
    
    client = TestClient(app)
    db = SessionLocal()

    try:
        # 1. Login as Trainer
        print("\n[Step 1] Logging in as Trainer (trainer@mospi.gov.in)...")
        login_resp = client.post(
            "/api/v1/auth/login",
            json={"email": "trainer@mospi.gov.in", "password": "password123"}
        )
        assert login_resp.status_code == 200, f"Trainer login failed: {login_resp.text}"
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("  ✓ Authenticated as Trainer.")

        # 2. Academy Dashboard
        print("\n[Step 2] Testing GET /api/v1/trainer/dashboard...")
        dash_resp = client.get("/api/v1/trainer/dashboard", headers=headers)
        assert dash_resp.status_code == 200, f"Dashboard failed: {dash_resp.text}"
        dash_data = dash_resp.json()
        print(f"  ✓ Director: {dash_data['director_name']} ({dash_data['designation']})")
        print(f"  ✓ Metrics: Assessed={dash_data['employees_assessed']}, Readiness={dash_data['average_readiness_pct']}%, Critical Gaps={dash_data['critical_gaps_count']}")

        # 3. Workforce Analytics
        print("\n[Step 3] Testing GET /api/v1/trainer/analytics/workforce...")
        wa_resp = client.get("/api/v1/trainer/analytics/workforce", headers=headers)
        assert wa_resp.status_code == 200, f"Workforce analytics failed: {wa_resp.text}"
        wa_data = wa_resp.json()
        print(f"  ✓ Overall Readiness: {wa_data['overall_readiness_pct']}% (Target: {wa_data['required_readiness_pct']}%)")
        print(f"  ✓ Heatmap Cells: {len(wa_data['heatmap_matrix'])} matrix points")

        # 4. Employee Directory & Twin
        print("\n[Step 4] Testing GET /api/v1/trainer/employees...")
        emp_resp = client.get("/api/v1/trainer/employees", headers=headers)
        assert emp_resp.status_code == 200, f"Employees list failed: {emp_resp.text}"
        employees = emp_resp.json()
        print(f"  ✓ Retrieved {len(employees)} workforce employee profiles.")
        
        target_emp_id = employees[0]["id"]
        print(f"\n[Step 5] Testing GET /api/v1/trainer/employees/{target_emp_id} (AI Competency Twin)...")
        twin_resp = client.get(f"/api/v1/trainer/employees/{target_emp_id}", headers=headers)
        assert twin_resp.status_code == 200, f"Employee twin failed: {twin_resp.text}"
        twin_data = twin_resp.json()
        print(f"  ✓ Competency Twin for {twin_data['name']}: {len(twin_data['competency_twin'])} evaluated dimensions.")

        # 6. AI Question Review
        print("\n[Step 6] Testing GET /api/v1/trainer/questions/review...")
        q_resp = client.get("/api/v1/trainer/questions/review", headers=headers)
        assert q_resp.status_code == 200, f"Question review failed: {q_resp.text}"
        q_data = q_resp.json()
        print(f"  ✓ RAG Questions Review Board: Total={q_data['total_generated']}, Approved={q_data['approved_count']}, Pending={q_data['pending_review_count']}")

        # 7. Learning Plans Monitor
        print("\n[Step 7] Testing GET /api/v1/trainer/learning-plans...")
        lp_resp = client.get("/api/v1/trainer/learning-plans", headers=headers)
        assert lp_resp.status_code == 200, f"Learning plans failed: {lp_resp.text}"
        lp_data = lp_resp.json()
        print(f"  ✓ Learning Plans Monitored: {lp_data['total_plans']} plans ({lp_data['at_risk_count']} at-risk)")

        # 8. Training Effectiveness & Before/After
        print("\n[Step 8] Testing GET /api/v1/trainer/training-effectiveness...")
        te_resp = client.get("/api/v1/trainer/training-effectiveness", headers=headers)
        assert te_resp.status_code == 200, f"Training effectiveness failed: {te_resp.text}"
        te_data = te_resp.json()
        print(f"  ✓ Training Effectiveness: Trained={te_data['total_trained_employees']}, Reassessed={te_data['total_reassessed_employees']}, Avg Gain=+{te_data['avg_competency_gain_pct']}%")

        # 9. AI Insights & Future Skills
        print("\n[Step 9] Testing GET /api/v1/trainer/insights & future-skills...")
        ins_resp = client.get("/api/v1/trainer/insights", headers=headers)
        fut_resp = client.get("/api/v1/trainer/future-skills", headers=headers)
        assert ins_resp.status_code == 200 and fut_resp.status_code == 200
        print(f"  ✓ Retrieved {len(ins_resp.json())} AI Insights & {len(fut_resp.json())} Future Skill Signals.")

        # 10. Alerts & Reports
        print("\n[Step 10] Testing GET /api/v1/trainer/alerts & reports...")
        alt_resp = client.get("/api/v1/trainer/alerts", headers=headers)
        rep_resp = client.get("/api/v1/trainer/reports", headers=headers)
        assert alt_resp.status_code == 200 and rep_resp.status_code == 200
        print(f"  ✓ System Alerts: {len(alt_resp.json())} items | Reports Catalog: {len(rep_resp.json())} reports.")

        print("\n" + "=" * 70)
        print("✓ ALL TRAINER PLATFORM BACKEND ENDPOINTS VERIFIED & OPERATIONAL!")
        print("=" * 70)

    finally:
        db.close()

if __name__ == "__main__":
    verify_trainer_endpoints()
