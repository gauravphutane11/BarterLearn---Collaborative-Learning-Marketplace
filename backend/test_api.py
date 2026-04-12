import requests
import json

# Change this if testing deployed backend
BASE_URL = "http://localhost:5000/api"
# BASE_URL = "https://barterlearn-collaborative-learning-45hs.onrender.com/api"


def test_flow():

    try:

        print("---- Starting API Test ----\n")

        # 1️⃣ Login
        print("1) Logging in...")

        res = requests.post(
            f"{BASE_URL}/login",
            json={
                "email": "alex@example.com",
                "password": "password"
            }
        )

        if res.status_code != 200:
            print("❌ Login failed:", res.text)
            return

        token = res.json()["access_token"]

        headers = {
            "Authorization": f"Bearer {token}"
        }

        print("✅ Login successful\n")

        # 2️⃣ Get Matches
        print("2) Fetching matches...")

        res = requests.get(f"{BASE_URL}/matches", headers=headers)

        if res.status_code != 200:
            print("❌ Failed to fetch matches:", res.text)
            return

        matches = res.json()

        print(f"Found {len(matches)} matches")

        if matches:

            first = matches[0]

            print(
                f"Top match: {first['name']} "
                f"(Score: {first['compatibilityScore']}%)"
            )

            if "commonSkills" in first:
                print(
                    "Common skills:",
                    json.dumps(first["commonSkills"], indent=2)
                )

        print()

        # 3️⃣ Create Exchange
        print("3) Creating exchange...")

        res = requests.post(
            f"{BASE_URL}/exchanges",
            headers=headers,
            json={
                "partner_id": 2,
                "skill": "React",
                "partner_skill": "UI/UX Design"
            }
        )

        if res.status_code != 201:
            print("❌ Failed to create exchange:", res.text)
            return

        exchange = res.json()
        exchange_id = exchange["id"]

        print(f"✅ Created exchange {exchange_id}\n")

        # 4️⃣ Update Sessions
        print("4) Logging session...")

        res = requests.patch(
            f"{BASE_URL}/exchanges/{exchange_id}",
            headers=headers,
            json={"sessions_completed": 1}
        )

        if res.status_code != 200:
            print("❌ Failed to update session:", res.text)
            return

        print(f"Sessions completed: {res.json()['sessionsCompleted']}\n")

        # 5️⃣ Complete Exchange
        print("5) Completing exchange...")

        res = requests.patch(
            f"{BASE_URL}/exchanges/{exchange_id}",
            headers=headers,
            json={
                "status": "completed",
                "rating": 5
            }
        )

        if res.status_code != 200:
            print("❌ Failed to complete exchange:", res.text)
            return

        final = res.json()

        print(
            f"Exchange status: {final['status']}, "
            f"Rating: {final['rating']}"
        )

        print("\n---- API TEST COMPLETED SUCCESSFULLY ----")

    except Exception as e:

        print("❌ Error during API test:", str(e))


if __name__ == "__main__":

    test_flow()