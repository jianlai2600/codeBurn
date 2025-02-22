import pymysql
import random
from faker import Faker

# 初始化 Faker 生成随机数据
fake = Faker()

# 连接 MySQL 数据库
conn = pymysql.connect(
    host="localhost",
    user="root",
    password="1991Lyf@@@",
    database="burncode",
    charset="utf8mb4"
)
cursor = conn.cursor()

try:
    ### **✅ 1. 插入 1000 个用户**
    print("Inserting Users...")
    usernames = set()
    for _ in range(1000):
        while True:
            username = fake.user_name()
            if username not in usernames:
                usernames.add(username)
                break
        email = fake.email()
        password = "hashed_password"
        avatar_url = fake.image_url()

        cursor.execute(
            "INSERT IGNORE INTO User (username, email, password, avatar_url) VALUES (%s, %s, %s, %s)",
            (username, email, password, avatar_url)
        )

    ### **✅ 2. 插入 2000 道 LeetCode 题目**
    print("Inserting Problems...")
    difficulties = ["Easy", "Medium", "Hard"]
    for i in range(1, 2001):
        title = f"Problem {i}"
        difficulty = random.choice(difficulties)
        url = f"https://leetcode.com/problems/problem-{i}/"

        cursor.execute(
            "INSERT IGNORE INTO Problem (title, difficulty, url) VALUES (%s, %s, %s)",
            (title, difficulty, url)
        )

    ### **✅ 3. 插入 100 家公司**
    print("Inserting Companies...")
    companies = {fake.company() for _ in range(100)}
    for company in companies:
        cursor.execute(
            "INSERT IGNORE INTO Company (company_name) VALUES (%s)", (company,)
        )

    ### **✅ 4. 插入 50 个题目标签**
    print("Inserting Tags...")
    tags = ["Array", "Graph", "DP", "Binary Search", "Sorting", "Recursion", "Greedy", "Backtracking"]
    for tag in tags:
        cursor.execute(
            "INSERT IGNORE INTO Tag (tag_name) VALUES (%s)", (tag,)
        )

    # **获取所有 ID**
    cursor.execute("SELECT user_id FROM User")
    user_ids = [row[0] for row in cursor.fetchall()]

    cursor.execute("SELECT problem_id FROM Problem")
    problem_ids = [row[0] for row in cursor.fetchall()]

    cursor.execute("SELECT company_id FROM Company")
    company_ids = [row[0] for row in cursor.fetchall()]

    cursor.execute("SELECT tag_id FROM Tag")
    tag_ids = [row[0] for row in cursor.fetchall()]

    ### **✅ 5. 插入 5000 条刷题记录**
    print("Inserting Solves...")
    statuses = ["Accepted", "Wrong Answer", "Time Limit Exceeded"]
    for _ in range(5000):
        user_id = random.choice(user_ids)  # 确保 user_id 存在
        problem_id = random.choice(problem_ids)  # 确保 problem_id 存在
        solve_date = fake.date_this_year()
        attempts = random.randint(1, 5)
        status = random.choice(statuses)

        cursor.execute(
            "INSERT INTO Solves (user_id, problem_id, solve_date, attempts, status) VALUES (%s, %s, %s, %s, %s)",
            (user_id, problem_id, solve_date, attempts, status)
        )

    ### **✅ 6. 插入 2000 条讨论记录**
    print("Inserting Discussions...")
    for _ in range(2000):
        user_id = random.choice(user_ids)
        problem_id = random.choice(problem_ids)
        content = fake.text()

        cursor.execute(
            "INSERT INTO Discussion (user_id, problem_id, content) VALUES (%s, %s, %s)",
            (user_id, problem_id, content)
        )

    ### **✅ 7. 关联题目和公司**
    print("Inserting AppearsIn (Problem-Company)...")
    for _ in range(2000):
        problem_id = random.choice(problem_ids)
        company_id = random.choice(company_ids)

        cursor.execute(
            "INSERT IGNORE INTO AppearsIn (problem_id, company_id) VALUES (%s, %s)",
            (problem_id, company_id)
        )

    ### **✅ 8. 关联题目和标签**
    print("Inserting HasTag (Problem-Tag)...")
    for _ in range(3000):
        problem_id = random.choice(problem_ids)
        tag_id = random.choice(tag_ids)

        cursor.execute(
            "INSERT IGNORE INTO HasTag (problem_id, tag_id) VALUES (%s, %s)",
            (problem_id, tag_id)
        )

    # **提交数据**
    conn.commit()
    print("✅ 数据插入完成！🎉")

except pymysql.MySQLError as e:
    print(f"❌ 数据插入失败: {e}")
    conn.rollback()

finally:
    cursor.close()
    conn.close()