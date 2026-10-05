import urllib.request
import urllib.error
import json
import sys
import time

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

live_backend = 'https://meet2action.in/api'
local_backend = 'http://127.0.0.1:8000/api'

def req(url, data=None, method='GET', token=None):
    r = urllib.request.Request(url, method=method)
    r.add_header('Content-Type', 'application/json')
    if token:
        r.add_header('Authorization', f'Bearer {token}')
    encoded = json.dumps(data).encode('utf-8') if data is not None else None
    try:
        res = urllib.request.urlopen(r, data=encoded, timeout=20)
        return res.status, json.loads(res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        try:
            return e.code, json.loads(body)
        except:
            return e.code, {'detail': body}

def run_tests_against(base_url, label):
    print(f"\n==========================================")
    print(f">> RUNNING AUTH TESTS AGAINST: {label}")
    print(f"URL: {base_url}")
    print(f"==========================================")

    # 1. Validation: invalid email format
    status, res = req(f'{base_url}/auth/register', {
        'name': 'Test User',
        'email': 'invalid-email',
        'password': 'password123',
        'confirm_password': 'password123'
    }, method='POST')
    assert status == 400, f"Expected 400 for invalid email, got {status}: {res}"
    print(f"[PASS] 1. Invalid email rejected correctly: {res['detail']}")

    # 2. Validation: short password
    status, res = req(f'{base_url}/auth/register', {
        'name': 'Test User',
        'email': 'valid@team.io',
        'password': '12',
        'confirm_password': '12'
    }, method='POST')
    assert status == 400, f"Expected 400 for short password, got {status}: {res}"
    print(f"[PASS] 2. Short password rejected correctly: {res['detail']}")

    # 3. Validation: password mismatch
    status, res = req(f'{base_url}/auth/register', {
        'name': 'Test User',
        'email': 'valid@team.io',
        'password': 'password123',
        'confirm_password': 'mismatchPassword'
    }, method='POST')
    assert status == 400, f"Expected 400 for password mismatch, got {status}: {res}"
    print(f"[PASS] 3. Password mismatch rejected correctly: {res['detail']}")

    # 4. Successful registration of new user
    test_email = f"hackathon.user.{int(time.time())}@team.io"
    test_name = "Alex Morgan"
    test_password = "HackathonPassword2026!"

    status, reg_data = req(f'{base_url}/auth/register', {
        'name': test_name,
        'email': test_email,
        'password': test_password,
        'confirm_password': test_password,
        'role': 'Fullstack Engineer'
    }, method='POST')
    assert status == 200, f"Registration failed with status {status}: {reg_data}"
    assert 'token' in reg_data, "Token missing in registration response"
    assert reg_data['user']['name'] == test_name, f"User name mismatch: {reg_data['user']}"
    assert reg_data['user']['email'] == test_email.lower()
    print(f"[PASS] 4. User registered successfully! ID: {reg_data['user']['id']}, Name: {reg_data['user']['name']}, Email: {reg_data['user']['email']}")

    # 5. Duplicate email validation
    status, res = req(f'{base_url}/auth/register', {
        'name': 'Another User',
        'email': test_email,
        'password': 'anotherpassword',
        'confirm_password': 'anotherpassword'
    }, method='POST')
    assert status == 400, f"Expected 400 for duplicate email, got {status}: {res}"
    print(f"[PASS] 5. Duplicate email rejected correctly: {res['detail']}")

    # 6. Login validation: Wrong password
    status, res = req(f'{base_url}/auth/login', {
        'email': test_email,
        'password': 'WrongPassword123'
    }, method='POST')
    assert status == 400, f"Expected 400 for wrong password, got {status}: {res}"
    print(f"[PASS] 6. Wrong password rejected correctly: {res['detail']}")

    # 7. Login validation: Non-existent email
    status, res = req(f'{base_url}/auth/login', {
        'email': 'nonexistent.user.999@team.io',
        'password': 'anyPassword'
    }, method='POST')
    assert status == 400, f"Expected 400 for non-existent email, got {status}: {res}"
    print(f"[PASS] 7. Non-existent email rejected correctly: {res['detail']}")

    # 8. Successful Login with newly registered credentials
    status, login_data = req(f'{base_url}/auth/login', {
        'email': test_email,
        'password': test_password
    }, method='POST')
    assert status == 200, f"Login failed with status {status}: {login_data}"
    user_token = login_data['token']
    logged_in_user = login_data['user']
    assert logged_in_user['name'] == test_name
    print(f"[PASS] 8. New user logged in successfully! Name: {logged_in_user['name']}, Token: {user_token}")

    # 9. Verify dashboard stats with new user's token
    status, stats = req(f'{base_url}/dashboard/stats', token=user_token)
    assert status == 200, f"Failed to fetch stats: {stats}"
    print(f"[PASS] 9. Dashboard access verified! Meetings: {stats['total_meetings']}, Tasks: {stats['total_action_items']}")

    # 10. Verify demo login endpoint still intact
    status, demo_data = req(f'{base_url}/auth/demo-login', data={}, method='POST')
    assert status == 200, f"Demo login failed: {demo_data}"
    print(f"[PASS] 10. Demo login verified! Demo user: {demo_data['user']['name']}")

    print(f"\n[SUCCESS] ALL 10 TESTS PASSED FOR {label}!")

if __name__ == '__main__':
    run_tests_against(local_backend, "LOCAL BACKEND (PORT 8000)")
    run_tests_against(live_backend, "PUBLIC LIVE BACKEND (CLOUDFLARE)")
    print("\n=======================================================")
    print("[ALL DONE] ALL AUTHENTICATION FLOWS VERIFIED 100% SUCCESSFUL!")
    print("=======================================================")
