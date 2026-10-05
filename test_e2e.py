import urllib.request
import json

base = 'http://127.0.0.1:8000/api'

def req(url, data=None, method='GET'):
    r = urllib.request.Request(url, method=method)
    r.add_header('Content-Type', 'application/json')
    if data:
        encoded = json.dumps(data).encode('utf-8')
        res = urllib.request.urlopen(r, data=encoded)
    else:
        res = urllib.request.urlopen(r)
    return json.loads(res.read().decode('utf-8'))

print('=== 1. Testing Demo Login ===')
auth = req(f'{base}/auth/demo-login', data={}, method='POST')
print(f"  User logged in: {auth['user']['name']} | Role: {auth['user']['role']}")

print('\n=== 2. Testing Dashboard Stats ===')
stats = req(f'{base}/dashboard/stats')
print(f"  Meetings: {stats['total_meetings']} | Action Items: {stats['total_action_items']} | Completion: {stats['completion_percentage']}%")

print('\n=== 3. Testing AI Analysis on Prompt Sample Meeting ===')
sample_text = (
    "Project review meeting. Poojasri will prepare the presentation by October 8. "
    "Rithanya will complete the dataset preparation by October 6. "
    "Poojitha will test the model by October 10. "
    "The team decided to use Python and FastAPI for the prototype."
)
analysis = req(f'{base}/meetings/analyze', data={
    'title': 'Project Review & Prototype Alignment',
    'date': '2026-10-04',
    'participants': 'Poojasri, Rithanya, Poojitha',
    'transcript': sample_text
}, method='POST')

print(f"  Summary: {analysis['summary']}")
print(f"  Decisions: {analysis['decisions']}")
print(f"  Extracted Action Items Count: {len(analysis['action_items'])}")
for a in analysis['action_items']:
    print(f"    - {a['assignee']} -> {a['task']} -> Due: {a['deadline']} [{a['priority']}]")

print('\n=== 4. Testing Meeting Creation ===')
new_m = req(f'{base}/meetings', data={
    'title': 'Project Review & Prototype Alignment',
    'date': '2026-10-04',
    'participants': 'Poojasri, Rithanya, Poojitha',
    'transcript': sample_text,
    'summary': analysis['summary'],
    'discussion_points': analysis['discussion_points'],
    'decisions': analysis['decisions'],
    'action_items': analysis['action_items']
}, method='POST')
print(f"  Created Meeting ID: {new_m['id']} | Actions saved: {len(new_m['action_items'])}")

print('\n=== 5. Testing Tasks Filtering & Updating ===')
tasks = req(f'{base}/tasks?status=Pending')
print(f"  Pending Tasks Count: {len(tasks)}")
first_task_id = tasks[0]['id']
updated_task = req(f'{base}/tasks/{first_task_id}', data={'status': 'Completed', 'progress': 100}, method='PUT')
print(f"  Updated Task: {updated_task['task']} | Status: {updated_task['status']} | Progress: {updated_task['progress']}%")

print('\n=== 6. Testing Accountability Scorecard ===')
acc = req(f'{base}/accountability')
print(f"  Total Members in Accountability: {len(acc['team_members'])}")
for m in acc['team_members']:
    print(f"    Team Member: {m['member']} | Assigned: {m['total_assigned']} | Completed: {m['completed']} | Pending: {m['pending']} | Overdue: {m['overdue']} | Completion: {m['completion_percentage']}%")

print('\n=== 7. Testing AI Insights ===')
ins = req(f'{base}/insights')
print(f"  Unresolved Tasks: {ins['unresolved_tasks_count']} | Active Contributors: {len(ins['people_with_pending_tasks'])}")
print(f"  Recommendations Count: {len(ins['actionable_recommendations'])}")
for r in ins['actionable_recommendations']:
    print(f"    [{r['type']}] {r['title']}: {r['description']}")

print('\nALL INTEGRATION API TESTS PASSED PERFECTLY!')
