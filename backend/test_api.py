import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_flow():
    # 1. Login
    print("Logging in...")
    res = requests.post(f"{BASE_URL}/login", json={"email": "alex@example.com", "password": "password"})
    if res.status_code != 200:
        print("Login failed")
        return
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Matches
    print("Fetching matches...")
    res = requests.get(f"{BASE_URL}/matches", headers=headers)
    matches = res.json()
    print(f"Found {len(matches)} matches")
    if len(matches) > 0:
        first = matches[0]
        print(f"Top match: {first['name']} (Score: {first['compatibilityScore']}%)")
        print(f"Common skills: {json.dumps(first['commonSkills'])}")

    # 3. Create Exchange
    print("Creating exchange...")
    res = requests.post(f"{BASE_URL}/exchanges", headers=headers, json={
        "partner_id": 2,
        "skill": "React",
        "partner_skill": "UI/UX Design"
    })
    exchange = res.json()
    exchange_id = exchange["id"]
    print(f"Created exchange {exchange_id}")

    # 4. Update Sessions
    print("Logging session...")
    res = requests.patch(f"{BASE_URL}/exchanges/{exchange_id}", headers=headers, json={
        "sessions_completed": 1
    })
    print(f"Sessions: {res.json()['sessionsCompleted']}")

    # 5. Complete Exchange
    print("Completing exchange...")
    res = requests.patch(f"{BASE_URL}/exchanges/{exchange_id}", headers=headers, json={
        "status": "completed",
        "rating": 5
    })
    print(f"Status: {res.json()['status']}, Rating: {res.json()['rating']}")

if __name__ == "__main__":
    # Ensure server is running
    try:
        test_flow()
    except Exception as e:
        print(f"Error: {e}")
