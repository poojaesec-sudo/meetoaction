import sys
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_endpoints():
    print("Testing /health ...")
    res = client.get("/health")
    assert res.status_code == 200, f"/health failed: {res.text}"
    print("  [PASS] /health:", res.json())

    print("Testing /api/health ...")
    res = client.get("/api/health")
    assert res.status_code == 200, f"/api/health failed: {res.text}"
    print("  [PASS] /api/health:", res.json())

    print("Testing /auth/demo-login ...")
    res = client.post("/auth/demo-login")
    assert res.status_code == 200, f"/auth/demo-login failed: {res.text}"
    login_data = res.json()
    token = login_data["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f"  [PASS] Demo user logged in: {login_data['user']['name']}")

    print("Testing /meetings ...")
    res = client.get("/meetings", headers=headers)
    assert res.status_code == 200, f"GET /meetings failed: {res.text}"
    meetings = res.json()
    print(f"  [PASS] Found {len(meetings)} meetings")

    print("Testing POST /meetings ...")
    new_meeting_payload = {
        "title": "Automated Test Sync Meeting",
        "date": "2026-10-06 10:00",
        "participants": "Poojasri, TestBot",
        "agenda": "1. Verify API reliability\n2. Confirm database persistence",
        "transcript": "Test meeting transcript. Poojasri will verify the endpoints by October 7. TestBot to run verification suites.",
        "summary": "Automated verification sync."
    }
    res = client.post("/meetings", json=new_meeting_payload, headers=headers)
    assert res.status_code == 201, f"POST /meetings failed: {res.text}"
    created_meeting = res.json()
    m_id = created_meeting["id"]
    print(f"  [PASS] Created meeting ID {m_id}: {created_meeting['title']}")

    print(f"Testing PUT /meetings/{m_id} ...")
    res = client.put(f"/meetings/{m_id}", json={"title": "Updated Test Sync Meeting"}, headers=headers)
    assert res.status_code == 200, f"PUT /meetings failed: {res.text}"
    print(f"  [PASS] Updated meeting title: {res.json()['title']}")

    print("Testing /action-items ...")
    res = client.get("/action-items", headers=headers)
    assert res.status_code == 200, f"GET /action-items failed: {res.text}"
    print(f"  [PASS] Retrieved {len(res.json())} action items")

    print("Testing POST /action-items ...")
    action_payload = {
        "task": "Automated Unit Verification",
        "description": "Verify action item creation",
        "assignee": "Poojasri",
        "priority": "High",
        "deadline": "October 7",
        "meeting_id": m_id
    }
    res = client.post("/action-items", json=action_payload, headers=headers)
    assert res.status_code == 201, f"POST /action-items failed: {res.text}"
    item = res.json()
    item_id = item["id"]
    print(f"  [PASS] Created action item ID {item_id}: {item['task']}")

    print(f"Testing PUT /action-items/{item_id} (complete) ...")
    res = client.put(f"/action-items/{item_id}", json={"status": "Completed"}, headers=headers)
    assert res.status_code == 200, f"PUT /action-items failed: {res.text}"
    print(f"  [PASS] Action item marked completed: status={res.json()['status']}, progress={res.json()['progress']}")

    print("Testing /team ...")
    res = client.get("/team", headers=headers)
    assert res.status_code == 200, f"GET /team failed: {res.text}"
    print(f"  [PASS] Retrieved {len(res.json())} team members")

    print("Testing POST /team ...")
    team_payload = {
        "name": "Jane Tester",
        "email": "jane@team.io",
        "role": "QA Architect",
        "status": "Active"
    }
    res = client.post("/team", json=team_payload, headers=headers)
    assert res.status_code == 201, f"POST /team failed: {res.text}"
    print(f"  [PASS] Added team member: {res.json()['name']}")

    print("Testing /ai/summarize ...")
    res = client.post("/ai/summarize", json={"notes": "Karthik will deploy the database. Poojasri to review slides."})
    assert res.status_code == 200, f"POST /ai/summarize failed: {res.text}"
    print(f"  [PASS] AI summary: {res.json()['summary']}")

    print("Testing /ai/action-items ...")
    res = client.post("/ai/action-items", json={"notes": "Karthik will deploy the database by Friday. Poojasri to review slides by Thursday."})
    assert res.status_code == 200, f"POST /ai/action-items failed: {res.text}"
    print(f"  [PASS] Extracted {len(res.json()['action_items'])} action items")

    print("Testing /ai/highlights ...")
    res = client.post("/ai/highlights", json={"notes": "Agreed to use FastAPI and React. Team reviewed sprint 1 deliverables."})
    assert res.status_code == 200, f"POST /ai/highlights failed: {res.text}"
    print(f"  [PASS] Highlights: {res.json()['highlights']}")

    print("Testing /ai/follow-ups ...")
    res = client.post("/ai/follow-ups", json={"notes": "Rithanya will finish dataset by tomorrow."})
    assert res.status_code == 200, f"POST /ai/follow-ups failed: {res.text}"
    print(f"  [PASS] Follow-ups: {res.json()['follow_up_points']}")

    # Clean up test meeting
    client.delete(f"/meetings/{m_id}", headers=headers)
    print("  [PASS] Cleaned up test meeting")

    print("\nALL FASTAPI BACKEND VERIFICATION TESTS PASSED SUCCESSFULLY! 100%")

if __name__ == "__main__":
    test_endpoints()
