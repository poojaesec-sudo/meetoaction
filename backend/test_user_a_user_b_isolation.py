import sys
import time
import json
import urllib.request
import urllib.error

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://127.0.0.1:8000"

def api_request(method, path, data=None, headers=None):
    if headers is None:
        headers = {}
    url = f"{BASE_URL}{path}"
    req_body = None
    if data is not None:
        req_body = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    
    req = urllib.request.Request(url, data=req_body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            res_body = response.read().decode("utf-8")
            return response.status, json.loads(res_body) if res_body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            parsed = json.loads(err_body)
        except Exception:
            parsed = {"raw": err_body}
        return e.code, parsed

def run_tests():
    print("=" * 70)
    print("VERIFYING COMPLETE FLOW: USER A vs USER B ISOLATION & DASHBOARD UPDATES")
    print("=" * 70)

    # 1. Health check
    status, res = api_request("GET", "/api/health")
    assert status == 200, f"Health check failed: {res}"
    print("[1] Backend Health Check: OK")

    # 2. Register User A
    ts = int(time.time())
    email_a = f"user.a.{ts}@hackathon.ai"
    reg_a = {
        "name": "User Alpha",
        "email": email_a,
        "password": "Password123!",
        "confirm_password": "Password123!"
    }
    status, res_a = api_request("POST", "/api/auth/register", data=reg_a)
    assert status == 200, f"User A registration failed: {res_a}"
    token_a = res_a.get("token") or res_a.get("access_token")
    headers_a = {"Authorization": f"Bearer {token_a}"}
    print(f"[2] Registered User A: {email_a} (ID: {res_a['user']['id']})")

    # 3. Verify User A has fresh empty dashboard (0 values)
    status, stats_a = api_request("GET", "/api/dashboard/stats", headers=headers_a)
    assert status == 200
    assert stats_a["total_meetings"] == 0, f"Expected 0 meetings, got {stats_a['total_meetings']}"
    assert stats_a["total_action_items"] == 0, f"Expected 0 action items, got {stats_a['total_action_items']}"
    assert stats_a["pending_tasks"] == 0, f"Expected 0 pending tasks, got {stats_a['pending_tasks']}"
    assert stats_a["completion_percentage"] == 0.0, f"Expected 0.0% completion, got {stats_a['completion_percentage']}"
    assert stats_a["recent_meetings"] == []
    assert stats_a["upcoming_deadlines"] == []
    print("[3] User A Initial State: Total Meetings = 0, Action Items = 0, Pending Tasks = 0, Completion Rate = 0%")

    # 4. Verify User A meetings, tasks, accountability, insights are empty
    status, meetings_a = api_request("GET", "/api/meetings", headers=headers_a)
    assert meetings_a == []
    status, tasks_a = api_request("GET", "/api/tasks", headers=headers_a)
    assert tasks_a == []
    status, acc_a = api_request("GET", "/api/accountability", headers=headers_a)
    assert acc_a["team_members"] == []
    assert acc_a["total_tasks"] == 0
    status, ins_a = api_request("GET", "/api/insights", headers=headers_a)
    assert ins_a["unresolved_tasks_count"] == 0
    assert ins_a["actionable_recommendations"] == []
    print("[4] User A Lists & Telemetry: Meetings=[], Tasks=[], Accountability=[], Insights=[]")

    # 5. User A analyzes a meeting with AI
    transcript = (
        "Alice: Team, let's review the alpha launch roadmap. Bob will implement the secure authentication by Wednesday.\n"
        "Charlie: I will configure the automated PostgreSQL backup replication by Friday.\n"
        "Alice: I will prepare the product walkthrough video by Monday. We all agreed to use FastAPI."
    )
    status, analysis = api_request("POST", "/api/meetings/analyze", data={"transcript": transcript})
    assert status == 200, f"AI Analysis failed: {analysis}"
    assert len(analysis.get("action_items", [])) >= 2
    assert "summary" in analysis
    print(f"[5] AI Analysis Extracted {len(analysis['action_items'])} tasks, summary, decisions & discussion points")

    # 6. User A saves the analyzed meeting
    meeting_payload = {
        "title": "Alpha Launch Roadmap & Infrastructure Sync",
        "date": "2026-10-05",
        "participants": "Alice, Bob, Charlie",
        "transcript": transcript,
        "summary": analysis.get("summary", "Alpha launch review"),
        "decisions": analysis.get("key_decisions", ["Use FastAPI"]),
        "discussion_points": analysis.get("discussion_points", ["Review alpha launch roadmap"]),
        "action_items": [
            {
                "task": item.get("task", "Action item"),
                "description": item.get("description", ""),
                "assignee": item.get("assignee", "Bob"),
                "deadline": item.get("deadline", "Wednesday"),
                "priority": item.get("priority", "High"),
                "status": "Pending",
                "progress": 0
            }
            for item in analysis.get("action_items", [])
        ]
    }
    status, created_m_a = api_request("POST", "/api/meetings", data=meeting_payload, headers=headers_a)
    assert status == 201, f"Failed to save meeting: {created_m_a}"
    print(f"[6] User A Saved Meeting: '{created_m_a['title']}' (ID: {created_m_a['id']})")

    # 7. Verify User A dashboard updates dynamically
    status, updated_stats_a = api_request("GET", "/api/dashboard/stats", headers=headers_a)
    assert status == 200
    assert updated_stats_a["total_meetings"] == 1, f"Expected 1 meeting, got {updated_stats_a['total_meetings']}"
    assert updated_stats_a["total_action_items"] > 0
    assert updated_stats_a["pending_tasks"] > 0
    assert len(updated_stats_a["recent_meetings"]) == 1
    assert updated_stats_a["recent_meetings"][0]["title"] == "Alpha Launch Roadmap & Infrastructure Sync"

    status, m_list_a = api_request("GET", "/api/meetings", headers=headers_a)
    assert len(m_list_a) == 1
    status, t_list_a = api_request("GET", "/api/tasks", headers=headers_a)
    assert len(t_list_a) > 0
    status, acc_updated_a = api_request("GET", "/api/accountability", headers=headers_a)
    assert len(acc_updated_a["team_members"]) > 0
    print(f"[7] User A Dashboard Updated: Total Meetings = 1, Action Items = {updated_stats_a['total_action_items']}, Pending Tasks = {updated_stats_a['pending_tasks']}")

    # 8. User A logs out (client drops token). Now Register User B!
    email_b = f"user.b.{ts}@hackathon.ai"
    reg_b = {
        "name": "User Beta",
        "email": email_b,
        "password": "Password123!",
        "confirm_password": "Password123!"
    }
    status, res_b = api_request("POST", "/api/auth/register", data=reg_b)
    assert status == 200, f"User B registration failed: {res_b}"
    token_b = res_b.get("token") or res_b.get("access_token")
    headers_b = {"Authorization": f"Bearer {token_b}"}
    print(f"[8] Registered User B: {email_b} (ID: {res_b['user']['id']})")

    # 9. Verify User B has a COMPLETELY EMPTY WORKSPACE (No User A data! No demo data!)
    status, stats_b = api_request("GET", "/api/dashboard/stats", headers=headers_b)
    assert status == 200
    assert stats_b["total_meetings"] == 0, f"DATA LEAK: User B sees {stats_b['total_meetings']} meetings!"
    assert stats_b["total_action_items"] == 0, f"DATA LEAK: User B sees {stats_b['total_action_items']} tasks!"
    assert stats_b["pending_tasks"] == 0
    assert stats_b["completion_percentage"] == 0.0
    assert stats_b["recent_meetings"] == [], f"DATA LEAK: User B sees recent meetings: {stats_b['recent_meetings']}"
    assert stats_b["upcoming_deadlines"] == []
    print("[9] Verified User B Dashboard: Starts completely from 0 (Total Meetings = 0, Action Items = 0)")

    status, meetings_b = api_request("GET", "/api/meetings", headers=headers_b)
    assert meetings_b == [], f"DATA LEAK: User B sees meetings: {meetings_b}"
    status, tasks_b = api_request("GET", "/api/tasks", headers=headers_b)
    assert tasks_b == [], f"DATA LEAK: User B sees tasks: {tasks_b}"
    status, acc_b = api_request("GET", "/api/accountability", headers=headers_b)
    assert acc_b["team_members"] == [], f"DATA LEAK: User B sees team members: {acc_b['team_members']}"
    status, ins_b = api_request("GET", "/api/insights", headers=headers_b)
    assert ins_b["unresolved_tasks_count"] == 0
    assert ins_b["actionable_recommendations"] == []
    print("[10] DATA ISOLATION VERIFIED: User B cannot see ANY of User A's meetings, tasks, accountability, or insights!")

    # 10. Verify Demo User still has their demo data untouched
    status, demo_res = api_request("POST", "/api/auth/demo-login")
    assert status == 200
    demo_token = demo_res.get("token") or demo_res.get("access_token")
    headers_demo = {"Authorization": f"Bearer {demo_token}"}
    status, demo_stats = api_request("GET", "/api/dashboard/stats", headers=headers_demo)
    assert demo_stats["total_meetings"] >= 10
    assert demo_stats["total_action_items"] >= 30
    status, demo_meetings = api_request("GET", "/api/meetings", headers=headers_demo)
    # Ensure neither User A nor User B meetings leaked into Demo account
    assert not any(m["title"] == "Alpha Launch Roadmap & Infrastructure Sync" for m in demo_meetings)
    print(f"[11] Demo Account Verified: Retains {demo_stats['total_meetings']} meetings & {demo_stats['total_action_items']} tasks without any cross-user contamination!")

    print("=" * 70)
    print("ALL TESTS PASSED: FULL DATA ISOLATION & FRESH USER LIFECYCLE 100% VERIFIED!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
