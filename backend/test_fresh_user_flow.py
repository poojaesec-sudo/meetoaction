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
    print("=" * 60)
    print("RUNNING COMPLETE NEW USER & DATA ISOLATION TEST SUITE")
    print("=" * 60)

    # 1. Health check
    status, res = api_request("GET", "/api/health")
    assert status == 200, f"Health check failed: {res}"
    print("[PASS] Health check OK")

    # 2. Register a brand-new user
    unique_suffix = int(time.time())
    new_user_email = f"fresh.user.{unique_suffix}@meet2action.ai"
    new_user_name = "Alex Carter"
    new_user_password = "Password123!"

    reg_payload = {
        "name": new_user_name,
        "email": new_user_email,
        "password": new_user_password,
        "confirm_password": new_user_password
    }
    status, reg_data = api_request("POST", "/api/auth/register", data=reg_payload)
    assert status == 200, f"Registration failed ({status}): {reg_data}"
    new_token = reg_data.get("token") or reg_data.get("access_token")
    assert new_token, f"No token in response: {reg_data}"
    assert reg_data["user"]["email"] == new_user_email
    assert reg_data["user"]["name"] == new_user_name
    print(f"[PASS] Successfully registered new user: {new_user_email} (ID: {reg_data['user']['id']})")

    new_headers = {"Authorization": f"Bearer {new_token}"}

    # 3. Test Dashboard Stats for fresh user
    status, stats = api_request("GET", "/api/dashboard/stats", headers=new_headers)
    assert status == 200, f"Stats failed ({status}): {stats}"
    print("Fresh User Stats:", stats)
    assert stats["total_meetings"] == 0, f"Expected 0 meetings, got {stats['total_meetings']}"
    assert stats["total_action_items"] == 0, f"Expected 0 action items, got {stats['total_action_items']}"
    assert stats["pending_tasks"] == 0, f"Expected 0 pending tasks, got {stats['pending_tasks']}"
    assert stats["completion_percentage"] == 0.0, f"Expected 0.0 completion percentage, got {stats['completion_percentage']}"
    assert stats["overdue_tasks"] == 0, f"Expected 0 overdue tasks, got {stats['overdue_tasks']}"
    assert stats["upcoming_deadlines"] == [], f"Expected empty upcoming deadlines, got {stats['upcoming_deadlines']}"
    assert stats["recent_meetings"] == [], f"Expected empty recent meetings, got {stats['recent_meetings']}"
    assert stats["priority_distribution"]["High"] == 0
    assert stats["priority_distribution"]["Medium"] == 0
    assert stats["priority_distribution"]["Low"] == 0
    assert stats["status_distribution"]["Pending"] == 0
    assert stats["status_distribution"]["Completed"] == 0
    print("[PASS] Fresh user dashboard starts completely from ZERO (no demo numbers)!")

    # 4. Test Meetings list for fresh user
    status, meetings = api_request("GET", "/api/meetings", headers=new_headers)
    assert status == 200
    assert meetings == [], f"Expected empty meetings, got {meetings}"
    print("[PASS] Fresh user meetings list is empty []")

    # 5. Test Tasks list for fresh user
    status, tasks = api_request("GET", "/api/tasks", headers=new_headers)
    assert status == 200
    assert tasks == [], f"Expected empty tasks, got {tasks}"
    print("[PASS] Fresh user tasks list is empty []")

    # 6. Test Accountability for fresh user
    status, acc = api_request("GET", "/api/accountability", headers=new_headers)
    assert status == 200
    assert acc["team_members"] == [], f"Expected no fake team members, got {acc['team_members']}"
    assert acc["total_tasks"] == 0
    assert acc["overall_completion_rate"] == 0.0
    print("[PASS] Fresh user accountability has NO fake team members or fake percentages!")

    # 7. Test AI Insights for fresh user
    status, insights = api_request("GET", "/api/insights", headers=new_headers)
    assert status == 200
    print("Fresh User Insights:", insights)
    assert insights["unresolved_tasks_count"] == 0
    assert insights["actionable_recommendations"] == []
    print("[PASS] Fresh user AI insights has NO fake productivity stats or fake recommendations!")

    # 8. Add First Meeting with AI Analysis
    transcript_sample = (
        "Alex: Let's finalize the Q3 launch plan. Sarah will build the customer landing page by Friday.\n"
        "David: I will review and deploy the new security patches by tomorrow.\n"
        "Alex: Great, I will prepare the investor pitch deck by next Monday."
    )
    status, analyzed = api_request("POST", "/api/meetings/analyze", data={"transcript": transcript_sample})
    assert status == 200, f"Analysis failed: {analyzed}"
    print(f"[PASS] AI transcript analyzed successfully. Extracted {len(analyzed.get('action_items', []))} action items.")

    raw_items = analyzed.get("action_items", [])
    clean_action_items = [
        {
            "task": item.get("task", "Action item"),
            "description": item.get("description", ""),
            "assignee": item.get("assignee", "Unassigned"),
            "deadline": item.get("deadline", "Not specified"),
            "priority": item.get("priority", "Medium"),
            "status": "Pending",
            "progress": 0
        }
        for item in raw_items
    ]

    meeting_payload = {
        "title": "Q3 Launch Planning Sync",
        "date": "2026-10-05",
        "participants": "Alex, Sarah, David",
        "transcript": transcript_sample,
        "summary": analyzed.get("summary", "Planning session for Q3"),
        "decisions": analyzed.get("key_decisions", ["Proceed with Q3 roadmap"]),
        "discussion_points": analyzed.get("discussion_points", ["Review launch timelines"]),
        "action_items": clean_action_items
    }
    status, created_meeting = api_request("POST", "/api/meetings", data=meeting_payload, headers=new_headers)
    assert status == 201, f"Create meeting failed: {created_meeting}"
    print(f"[PASS] Successfully created meeting '{created_meeting['title']}' for user {new_user_email}")

    # 9. Verify Dashboard automatically updates with real user data
    status, updated_stats = api_request("GET", "/api/dashboard/stats", headers=new_headers)
    assert status == 200
    print("Updated User Stats:", updated_stats)
    assert updated_stats["total_meetings"] == 1, f"Expected 1 meeting, got {updated_stats['total_meetings']}"
    assert updated_stats["total_action_items"] > 0, f"Expected >0 tasks, got {updated_stats['total_action_items']}"
    assert len(updated_stats["recent_meetings"]) == 1
    assert updated_stats["recent_meetings"][0]["title"] == "Q3 Launch Planning Sync"
    print("[PASS] Dashboard successfully updated from 0 to 1 meeting and real extracted tasks!")

    # 10. Verify Data Isolation against Demo Account
    status, demo_res = api_request("POST", "/api/auth/demo-login")
    assert status == 200
    demo_token = demo_res.get("token") or demo_res.get("access_token")
    demo_headers = {"Authorization": f"Bearer {demo_token}"}

    status, demo_stats = api_request("GET", "/api/dashboard/stats", headers=demo_headers)
    assert status == 200
    print(f"Demo Account Stats: Total Meetings = {demo_stats['total_meetings']}, Tasks = {demo_stats['total_action_items']}")
    assert demo_stats["total_meetings"] >= 10, f"Demo account should retain sample meetings, got {demo_stats['total_meetings']}"
    assert demo_stats["total_action_items"] >= 30, f"Demo account should retain sample tasks, got {demo_stats['total_action_items']}"

    # Verify demo meetings do not contain the new user's meeting
    status, demo_meetings = api_request("GET", "/api/meetings", headers=demo_headers)
    assert status == 200
    new_user_meeting_in_demo = any(m["title"] == "Q3 Launch Planning Sync" for m in demo_meetings)
    assert not new_user_meeting_in_demo, "Data leak: New user's meeting appeared in demo account!"
    print("[PASS] Data isolation verified: New user's meeting is NOT visible to demo account!")

    # Verify new user cannot see demo meetings
    status, new_user_meetings = api_request("GET", "/api/meetings", headers=new_headers)
    assert status == 200
    assert len(new_user_meetings) == 1
    assert new_user_meetings[0]["title"] == "Q3 Launch Planning Sync"
    print("[PASS] Data isolation verified: New user only sees their own 1 meeting!")

    print("=" * 60)
    print("ALL TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 60)

if __name__ == "__main__":
    run_tests()
