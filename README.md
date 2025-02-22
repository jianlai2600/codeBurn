# codeBurn

📌 回顾你的数据库设计

你的数据库用于 记录 LeetCode 刷题进展，并支持讨论功能。我们之前设计了 五个核心数据表，分别对应：
	1.	User（用户）
	2.	Problem（题目）
	3.	Company（公司）
	4.	Tag（标签）
	5.	Discussion（讨论）

此外，还有 三张关系表：
	•	Solves（用户刷题记录）
	•	AppearsIn（题目-公司关联）
	•	HasTag（题目-标签关联）

📌 1. 数据库表设计

✅ 1.1 用户表（User）

存储用户信息，如用户名、邮箱、密码、头像等。

CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

✅ 1.2 题目表（Problem）

存储 LeetCode 题目信息，包括题目名称、难度、链接等。

CREATE TABLE Problem (
    problem_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) UNIQUE NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    url VARCHAR(512) NOT NULL
);

✅ 1.3 公司表（Company）

存储公司信息，记录哪些公司考过哪些题。

CREATE TABLE Company (
    company_id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255) UNIQUE NOT NULL
);

✅ 1.4 题目标签表（Tag）

存储题目的分类标签，如 Array、Graph、Dynamic Programming。

CREATE TABLE Tag (
    tag_id INT PRIMARY KEY AUTO_INCREMENT,
    tag_name VARCHAR(255) UNIQUE NOT NULL
);

✅ 1.5 讨论表（Discussion）

存储用户在题目下的讨论。

CREATE TABLE Discussion (
    discussion_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    problem_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES Problem(problem_id) ON DELETE CASCADE
);

📌 2. 关系表设计

✅ 2.1 用户刷题记录（Solves）

记录用户做过的题目，包括提交时间、提交状态等。

CREATE TABLE Solves (
    solve_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    problem_id INT NOT NULL,
    solve_date DATE NOT NULL,
    attempts INT DEFAULT 1,
    status ENUM('Accepted', 'Wrong Answer', 'Time Limit Exceeded') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES Problem(problem_id) ON DELETE CASCADE
);

✅ 2.2 题目在哪些公司面试中出现（AppearsIn）

记录哪些公司考过哪些题目。

CREATE TABLE AppearsIn (
    problem_id INT NOT NULL,
    company_id INT NOT NULL,
    PRIMARY KEY (problem_id, company_id),
    FOREIGN KEY (problem_id) REFERENCES Problem(problem_id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES Company(company_id) ON DELETE CASCADE
);

✅ 2.3 题目与标签关联（HasTag）

记录题目所属的标签分类。

CREATE TABLE HasTag (
    problem_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (problem_id, tag_id),
    FOREIGN KEY (problem_id) REFERENCES Problem(problem_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tag(tag_id) ON DELETE CASCADE
);