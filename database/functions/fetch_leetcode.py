import requests
import pymysql
import time

# 连接 RDS MySQL
conn = pymysql.connect(
    host="database-1.cpe0kkg0uyqt.us-east-2.rds.amazonaws.com",
    user="admin",
    password="1991Lyf!!!",
    database="burncode",
    charset="utf8mb4"
)
cursor = conn.cursor()

# 建表（如未建）
cursor.execute('''
CREATE TABLE IF NOT EXISTS leetcode_questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    frontend_id VARCHAR(10),
    title VARCHAR(255),
    title_slug VARCHAR(255),
    difficulty VARCHAR(20),
    paid_only BOOLEAN,
    ac_rate FLOAT,
    tags TEXT
)
''')
conn.commit()

# GraphQL 设置
url = "https://leetcode.com/graphql"
headers = {
    "Content-Type": "application/json",
    "Referer": "https://leetcode.com",
    "User-Agent": "Mozilla/5.0"
}

# 分页插入
limit = 50
skip = 0
total_inserted = 0

while True:
    query = f'''
    query {{
      problemsetQuestionListV2(
        categorySlug: ""
        limit: {limit}
        skip: {skip}
      ) {{
        questions {{
          questionFrontendId
          title
          titleSlug
          difficulty
          paidOnly
          acRate
          topicTags {{
            name
          }}
        }}
      }}
    }}
    '''
    try:
        response = requests.post(url, json={"query": query}, headers=headers)
        data = response.json()
        questions = data["data"]["problemsetQuestionListV2"]["questions"]
        if not questions:
            break

        for q in questions:
            frontend_id = q.get("questionFrontendId")
            title = q.get("title")
            title_slug = q.get("titleSlug")
            difficulty = q.get("difficulty")
            paid_only = q.get("paidOnly")
            ac_rate = q.get("acRate")
            tags = ", ".join(tag["name"] for tag in q.get("topicTags", []))

            cursor.execute('''
                INSERT INTO leetcode_questions
                (frontend_id, title, title_slug, difficulty, paid_only, ac_rate, tags)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            ''', (frontend_id, title, title_slug, difficulty, paid_only, ac_rate, tags))
            total_inserted += 1

        conn.commit()
        print(f"✅ Inserted {len(questions)} questions, total so far: {total_inserted}")
        skip += limit
        time.sleep(0.5)

    except Exception as e:
        print("❌ Error:", e)
        break

cursor.close()
conn.close()
print(f"🎉 Done! Total inserted: {total_inserted}")