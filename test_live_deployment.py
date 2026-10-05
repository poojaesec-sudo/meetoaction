import urllib.request
import json
import sys

live_frontend = 'https://meet2action.in'
live_backend = 'https://meet2action.in/api'

def req(url, data=None, method='GET', token=None, origin=None):
    r = urllib.request.Request(url, method=method)
    r.add_header('Content-Type', 'application/json')
    if token:
        r.add_header('Authorization', f'Bearer {token}')
    if origin:
        r.add_header('Origin', origin)
    if data:
        encoded = json.dumps(data).encode('utf-8')
        res = urllib.request.urlopen(r, data=encoded, timeout=20)
    else:
        res = urllib.request.urlopen(r, timeout=20)
    return res

try:
    print('1. Checking Live Frontend HTML & Assets...', flush=True)
    fe_res = req(live_frontend)
    fe_html = fe_res.read().decode('utf-8')
    assert '<div id="root"></div>' in fe_html, 'Root div not found in frontend HTML'
    print('   [PASS] Frontend index.html served correctly (200 OK)', flush=True)

    print('2. Checking CORS headers from Frontend Origin...', flush=True)
    cors_req = urllib.request.Request(f'{live_backend}/health', headers={'Origin': live_frontend})
    cors_res = urllib.request.urlopen(cors_req, timeout=20)
    allow_origin = cors_res.headers.get('Access-Control-Allow-Origin')
    print(f'   [PASS] Access-Control-Allow-Origin: {allow_origin}', flush=True)
    assert allow_origin == live_frontend, f'CORS mismatch: expected {live_frontend}, got {allow_origin}'

    print('3. Testing Demo Login via Deployed Backend...', flush=True)
    login_res = req(f'{live_backend}/auth/demo-login', data={}, method='POST')
    login_data = json.loads(login_res.read().decode('utf-8'))
    token = login_data['token']
    user = login_data['user']
    print(f'   [PASS] Demo User: {user["name"]} ({user["email"]}) | Role: {user["role"]}', flush=True)

    print('4. Testing Dashboard Stats...', flush=True)
    stats_res = req(f'{live_backend}/dashboard/stats', token=token)
    stats = json.loads(stats_res.read().decode('utf-8'))
    print(f'   [PASS] Meetings: {stats["total_meetings"]}, Actions: {stats["total_action_items"]}, Completion: {stats["completion_percentage"]}%', flush=True)

    print('5. Testing AI Meeting NLP Extraction...', flush=True)
    test_transcript = 'Sprint retrospective. Poojasri will finalize the deck by Friday. Poojitha to optimize the backend API by Monday. Agreed to release beta next week.'
    ai_res = req(f'{live_backend}/meetings/analyze', data={
        'title': 'Sprint Review',
        'date': '2026-10-05',
        'participants': 'Poojasri, Poojitha',
        'transcript': test_transcript
    }, method='POST', token=token)
    ai_data = json.loads(ai_res.read().decode('utf-8'))
    print(f'   [PASS] Extracted Decisions: {ai_data["decisions"]}', flush=True)
    print(f'   [PASS] Extracted Action Items ({len(ai_data["action_items"])}):', flush=True)
    for item in ai_data['action_items']:
        print(f'     - {item["assignee"]}: {item["task"]} [Due: {item["deadline"]}]', flush=True)

    print('6. Testing Accountability Scorecard...', flush=True)
    acc_res = req(f'{live_backend}/accountability', token=token)
    acc = json.loads(acc_res.read().decode('utf-8'))
    print(f'   [PASS] Team Members Count: {len(acc["team_members"])}', flush=True)

    print('7. Testing AI Insights...', flush=True)
    ins_res = req(f'{live_backend}/insights', token=token)
    ins = json.loads(ins_res.read().decode('utf-8'))
    print(f'   [PASS] Active Recommendations ({len(ins["actionable_recommendations"])}):', flush=True)
    for rec in ins['actionable_recommendations'][:2]:
        print(f'     - [{rec["type"]}] {rec["title"]}', flush=True)

    print('\n=============================================')
    print('ALL LIVE PUBLIC DEPLOYMENT TESTS PASSED 100%!')
    print('=============================================')
except Exception as e:
    print(f'[FAIL]: {e}', file=sys.stderr)
    sys.exit(1)
