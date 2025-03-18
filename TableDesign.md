📌 Complete Database Schema

✅ 1. Entity Sets

These tables store independent entity data.

1.1 User Table (User)

Stores basic user information.

CREATE TABLE User (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

1.2 Problem Table (Problem)

Stores information about LeetCode-style problems.

CREATE TABLE Problem (
    problem_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) UNIQUE NOT NULL,
    difficulty ENUM('Easy', 'Medium', 'Hard') NOT NULL,
    url VARCHAR(512) NOT NULL
);

1.3 Company Table (Company)

Stores information about companies that have used specific problems in interviews.

CREATE TABLE Company (
    company_id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(255) UNIQUE NOT NULL
);

1.4 Problem Tag Table (Tag)

Stores classification tags for LeetCode-style problems.

CREATE TABLE Tag (
    tag_id INT PRIMARY KEY AUTO_INCREMENT,
    tag_name VARCHAR(255) UNIQUE NOT NULL
);

1.5 Discussion Table (Discussion)

Stores user discussions related to problems.

CREATE TABLE Discussion (
    discussion_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    problem_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES Problem(problem_id) ON DELETE CASCADE
);

✅ 2. Relationship Sets

These tables store relationships between entities.

2.1 Problem-Solving Records (Solves)

Stores records of problems solved by users, including submission time and status.

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

2.2 Problems Appearing in Company Interviews (AppearsIn)

Records which companies have asked specific problems in their interviews.

CREATE TABLE AppearsIn (
    problem_id INT NOT NULL,
    company_id INT NOT NULL,
    PRIMARY KEY (problem_id, company_id),
    FOREIGN KEY (problem_id) REFERENCES Problem(problem_id) ON DELETE CASCADE,
    FOREIGN KEY (company_id) REFERENCES Company(company_id) ON DELETE CASCADE
);

2.3 Problem-Tag Association (HasTag)

Stores the classification of problems based on tags.

CREATE TABLE HasTag (
    problem_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (problem_id, tag_id),
    FOREIGN KEY (problem_id) REFERENCES Problem(problem_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES Tag(tag_id) ON DELETE CASCADE
);

2.4 User Followed Problems (Follows)

Stores problems that users have followed.

CREATE TABLE Follows (
    user_id INT NOT NULL,
    problem_id INT NOT NULL,
    PRIMARY KEY (user_id, problem_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES Problem(problem_id) ON DELETE CASCADE
);

2.5 User Discussion Likes (UserDiscussionLikes)

Stores records of users liking discussions.

CREATE TABLE UserDiscussionLikes (
    user_id INT NOT NULL,
    discussion_id INT NOT NULL,
    PRIMARY KEY (user_id, discussion_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (discussion_id) REFERENCES Discussion(discussion_id) ON DELETE CASCADE
);

📌 Summary of the Database Schema

Category	Table Name	Description
Entity Tables	User	Stores user information
	Problem	Stores LeetCode-style problems
	Company	Stores company information
	Tag	Stores problem classification tags
	Discussion	Stores discussions related to problems
Relationship Tables	Solves	Tracks problem-solving activities (User ↔ Problem)
	AppearsIn	Records company problem usage (Problem ↔ Company)
	HasTag	Associates problems with tags (Problem ↔ Tag)
	Follows	Tracks user-followed problems (User ↔ Problem)
	UserDiscussionLikes	Tracks discussion likes (User ↔ Discussion)