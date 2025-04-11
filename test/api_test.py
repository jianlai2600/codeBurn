import requests

url = "https://leetcode.com/graphql"
headers = {
    "Content-Type": "application/json",
    "Referer": "https://leetcode.com",
    "User-Agent": "Mozilla/5.0"
}

query = '''
query {
  problemsetQuestionListV2(
    categorySlug: ""
    limit: 20
    skip: 0
  ) {
    questions {
      title
      titleSlug
      difficulty
      paidOnly
      topicTags {
        name
        slug
      }
    }
  }
}
'''

response = requests.post(url, json={"query": query}, headers=headers)
data = response.json()

if "errors" in data:
    print("❌ GraphQL returned errors:")
    for err in data["errors"]:
        print(" -", err["message"])
elif "data" not in data:
    print("❌ No data returned. Full response:")
    print(data)
else:
    for q in data["data"]["problemsetQuestionListV2"]["questions"]:
        print(f"{q['title']} ({q['difficulty']}) - https://leetcode.com/problems/{q['titleSlug']}")