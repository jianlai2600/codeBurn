import pymysql
import random

# 连接数据库
conn = pymysql.connect(
    host="database-1.cpe0kkg0uyqt.us-east-2.rds.amazonaws.com",  # 替换为你的 RDS 终端节点
    user="admin",  # 替换为你的 RDS 用户名
    password="1991Lyf!!!",  # 替换为你的 RDS 密码
    database="burncode",  # 你的数据库名
    charset="utf8mb4"
)

cursor = conn.cursor()

try:
    # 获取所有 user_id 和 discussion_id
    cursor.execute("SELECT user_id FROM User")
    user_ids = [row[0] for row in cursor.fetchall()]

    cursor.execute("SELECT discussion_id FROM Discussion")
    discussion_ids = [row[0] for row in cursor.fetchall()]

    ### **✅ 插入 5000 条用户点赞讨论记录**
    print("Inserting UserDiscussionLikes (User - Discussion Likes)...")
    for _ in range(5000):
        user_id = random.choice(user_ids)
        discussion_id = random.choice(discussion_ids)

        cursor.execute(
            "INSERT IGNORE INTO UserDiscussionLikes (user_id, discussion_id) VALUES (%s, %s)",
            (user_id, discussion_id)
        )

    # **提交数据**
    conn.commit()
    print("✅ UserDiscussionLikes 数据插入完成！🎉")

except pymysql.MySQLError as e:
    print(f"❌ 数据插入失败: {e}")
    conn.rollback()

finally:
    cursor.close()
    conn.close()