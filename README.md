📌 数据库完整表结构

✅ 1. 实体集（Entity Sets）

	这些表存储独立的实体数据

1.1 用户表（User）

存储用户的基本信息

CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

1.2 题目表（Problem）

存储 LeetCode 题目信息

CREATE TABLE Problem (
    problem_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) UNIQUE NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    url VARCHAR(512) NOT NULL
);

1.3 公司表（Company）

存储公司信息，哪些公司考过哪些题

CREATE TABLE Company (
    company_id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255) UNIQUE NOT NULL
);

1.4 题目标签表（Tag）

存储 LeetCode 题目的分类标签

CREATE TABLE Tag (
    tag_id INT PRIMARY KEY AUTO_INCREMENT,
    tag_name VARCHAR(255) UNIQUE NOT NULL
);

1.5 讨论表（Discussion）

存储用户对题目的讨论

CREATE TABLE Discussion (
    discussion_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    problem_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES Problem(problem_id) ON DELETE CASCADE
);

✅ 2. 关系表（Relationship Sets）

	这些表存储实体之间的关联数据

2.1 用户刷题记录（Solves）

存储用户做过的题目、提交时间、状态等

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

2.2 题目在哪些公司面试中出现（AppearsIn）

记录哪些公司考过哪些题目

CREATE TABLE AppearsIn (
    problem_id INT NOT NULL,
    company_id INT NOT NULL,
    PRIMARY KEY (problem_id, company_id),
    FOREIGN KEY (problem_id) REFERENCES Problem(problem_id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES Company(company_id) ON DELETE CASCADE
);

2.3 题目与标签关联（HasTag）

存储题目所属的标签分类

CREATE TABLE HasTag (
    problem_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (problem_id, tag_id),
    FOREIGN KEY (problem_id) REFERENCES Problem(problem_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tag(tag_id) ON DELETE CASCADE
);

2.4 用户关注题目（Follows）

存储用户关注的题目

CREATE TABLE Follows (
    user_id INT NOT NULL,
    problem_id INT NOT NULL,
    PRIMARY KEY (user_id, problem_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES Problem(problem_id) ON DELETE CASCADE
);

2.5 用户点赞讨论（UserDiscussionLikes）

存储用户对讨论的点赞记录

CREATE TABLE UserDiscussionLikes (
    user_id INT NOT NULL,
    discussion_id INT NOT NULL,
    PRIMARY KEY (user_id, discussion_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (discussion_id) REFERENCES Discussion(discussion_id) ON DELETE CASCADE
);

📌 数据库完整结构总结

分类	表名	描述
实体表	User	存储用户信息
	Problem	存储 LeetCode 题目
	Company	存储公司信息
	Tag	存储题目标签
	Discussion	存储题目讨论
关系表	Solves	记录用户刷题情况（User ↔ Problem）
	AppearsIn	记录题目在哪些公司考察过（Problem ↔ Company）
	HasTag	记录题目和标签的关联（Problem ↔ Tag）
	Follows	记录用户关注的题目（User ↔ Problem）
	UserDiscussionLikes	记录用户点赞的讨论（User ↔ Discussion）
