import pymysql
import random
from faker import Faker

# 初始化 Faker 生成随机数据
fake = Faker()

# 连接 MySQL 数据库
conn = pymysql.connect(
    host="database-1.cpe0kkg0uyqt.us-east-2.rds.amazonaws.com",  # 替换为你的 RDS 终端节点
    user="admin",  # 替换为你的 RDS 用户名
    password="1991Lyf!!!",  # 替换为你的 RDS 密码
    database="burncode",  # 你的数据库名
    charset="utf8mb4"
)

cursor = conn.cursor()

try:
    # **获取所有用户 ID**
    cursor.execute("SELECT user_id FROM User")
    user_ids = [row[0] for row in cursor.fetchall()]

    # **获取所有题目 ID**
    cursor.execute("SELECT problem_id FROM Problem")
    problem_ids = [row[0] for row in cursor.fetchall()]

    ### **✅ 插入 5000 条用户关注题目的记录**
    print("Inserting Follows (User-Problem follows)...")
    follows_set = set()  # 避免重复

    for _ in range(5000):
        user_id = random.choice(user_ids)
        problem_id = random.choice(problem_ids)

        # 避免重复关注
        if (user_id, problem_id) in follows_set:
            continue
        follows_set.add((user_id, problem_id))

        cursor.execute(
            "INSERT IGNORE INTO Follows (user_id, problem_id, followed_at) VALUES (%s, %s, %s)",
            (user_id, problem_id, fake.date_this_year())
        )

    # **提交数据**
    conn.commit()
    print("✅ 用户关注数据插入完成！🎉")

except pymysql.MySQLError as e:
    print(f"❌ 数据插入失败: {e}")
    conn.rollback()

finally:
    cursor.close()
    conn.close()