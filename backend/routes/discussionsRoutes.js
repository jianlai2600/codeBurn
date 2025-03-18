const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🔹 获取所有讨论（包含用户、题目信息以及点赞数）
router.get("/", (req, res) => {
    db.query(
        `SELECT d.discussion_id, u.username, p.title AS problem_title, d.content, d.created_at,
                COUNT(l.user_id) AS like_count
         FROM Discussion d
         JOIN User u ON d.user_id = u.user_id
         JOIN Problem p ON d.problem_id = p.problem_id
         LEFT JOIN UserDiscussionLikes l ON d.discussion_id = l.discussion_id
         GROUP BY d.discussion_id, u.username, p.title, d.content, d.created_at
         ORDER BY d.created_at DESC;`,
        (err, results) => {
            if (err) {
                res.status(500).json({ error: "Failed to retrieve discussions" });
            } else {
                res.json(results);
            }
        }
    );
});

// 🔹 获取特定的讨论详细信息（包含哪些用户点赞了）
router.get("/:discussion_id", (req, res) => {
    const { discussion_id } = req.params;

    db.query(
        `SELECT d.discussion_id, u.username, p.title AS problem_title, d.content, d.created_at
         FROM Discussion d
         JOIN User u ON d.user_id = u.user_id
         JOIN Problem p ON d.problem_id = p.problem_id
         WHERE d.discussion_id = ?;`,
        [discussion_id],
        (err, discussionResults) => {
            if (err) {
                return res.status(500).json({ error: "Failed to retrieve discussion details" });
            }
            if (discussionResults.length === 0) {
                return res.status(404).json({ error: "Discussion not found" });
            }

            db.query(
                `SELECT u.user_id, u.username 
                 FROM UserDiscussionLikes l
                 JOIN User u ON l.user_id = u.user_id
                 WHERE l.discussion_id = ?;`,
                [discussion_id],
                (err, likesResults) => {
                    if (err) {
                        return res.status(500).json({ error: "Failed to retrieve discussion likes" });
                    }

                    res.json({
                        discussion: discussionResults[0],
                        liked_by: likesResults
                    });
                }
            );
        }
    );
});

// 🔹 获取某个用户发表的所有讨论
router.get("/user/:user_id", (req, res) => {
    const { user_id } = req.params;

    db.query(
        `SELECT d.discussion_id, p.title AS problem_title, d.content, d.created_at
         FROM Discussion d
         JOIN Problem p ON d.problem_id = p.problem_id
         WHERE d.user_id = ? 
         ORDER BY d.created_at DESC;`,
        [user_id],
        (err, results) => {
            if (err) {
                res.status(500).json({ error: "Failed to retrieve discussions for this user" });
            } else {
                res.json(results);
            }
        }
    );
});

// 🔹 获取某个题目下的所有讨论
router.get("/problem/:problem_id", (req, res) => {
    const { problem_id } = req.params;

    db.query(
        `SELECT d.discussion_id, u.username, d.content, d.created_at
         FROM Discussion d
         JOIN User u ON d.user_id = u.user_id
         WHERE d.problem_id = ? 
         ORDER BY d.created_at DESC;`,
        [problem_id],
        (err, results) => {
            if (err) {
                res.status(500).json({ error: "Failed to retrieve discussions for this problem" });
            } else {
                res.json(results);
            }
        }
    );
});

// 🔹 添加新的讨论
router.post("/", (req, res) => {
    const { user_id, problem_id, content } = req.body;

    console.log("🔹 Received POST /api/discussions:", req.body);

    // 🛠️ 检查是否提供了必要字段
    if (!user_id || !problem_id || !content) {
        console.error("❌ Missing required fields:", { user_id, problem_id, content });
        return res.status(400).json({ error: "Missing required fields: user_id, problem_id, content" });
    }

    // 🛠️ 查询 user_id 是否存在
    db.query("SELECT user_id FROM User WHERE user_id = ?", [user_id], (err, userResults) => {
        if (err) {
            console.error("❌ Database error when checking user:", err);
            return res.status(500).json({ error: "Database error while checking user" });
        }

        if (userResults.length === 0) {
            console.error("❌ User ID not found:", user_id);
            return res.status(404).json({ error: `User ID ${user_id} not found` });
        }

        // 🛠️ 查询 problem_id 是否存在
        db.query("SELECT problem_id FROM Problem WHERE problem_id = ?", [problem_id], (err, problemResults) => {
            if (err) {
                console.error("❌ Database error when checking problem:", err);
                return res.status(500).json({ error: "Database error while checking problem" });
            }

            if (problemResults.length === 0) {
                console.error("❌ Problem ID not found:", problem_id);
                return res.status(404).json({ error: `Problem ID ${problem_id} not found` });
            }

            // 🛠️ 插入讨论
            const insertQuery = "INSERT INTO Discussion (user_id, problem_id, content) VALUES (?, ?, ?)";
            db.query(insertQuery, [user_id, problem_id, content], (err, results) => {
                if (err) {
                    console.error("❌ Failed to insert discussion:", err);
                    return res.status(500).json({ error: "Failed to add discussion" });
                }

                console.log("✅ Discussion added successfully, ID:", results.insertId);
                res.json({ message: "Discussion added successfully", id: results.insertId });
            });
        });
    });
});

// 🔹 删除讨论（同时删除相关点赞记录）
router.delete("/:discussion_id", (req, res) => {
    const { discussion_id } = req.params;

    db.query("DELETE FROM UserDiscussionLikes WHERE discussion_id = ?", [discussion_id], (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to delete likes" });
        }

        db.query("DELETE FROM Discussion WHERE discussion_id = ?", [discussion_id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Failed to delete discussion" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: "Discussion not found" });
            }
            res.json({ message: "Discussion deleted successfully" });
        });
    });
});

// 🔹 编辑讨论
router.put("/:discussion_id", (req, res) => {
    const { discussion_id } = req.params;
    const { content } = req.body;

    db.query(
        "UPDATE Discussion SET content = ? WHERE discussion_id = ?",
        [content, discussion_id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Failed to update discussion" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: "Discussion not found" });
            }
            res.json({ message: "Discussion updated successfully" });
        }
    );
});

// 🔹 点赞讨论
router.post("/:discussion_id/like", (req, res) => {
    const { user_id } = req.body;
    const { discussion_id } = req.params;

    db.query(
        "INSERT IGNORE INTO UserDiscussionLikes (user_id, discussion_id) VALUES (?, ?)",
        [user_id, discussion_id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Failed to like discussion" });
            }
            res.json({ message: "Discussion liked successfully" });
        }
    );
});

// 🔹 取消点赞讨论
router.delete("/:discussion_id/unlike", (req, res) => {
    const { user_id } = req.body;
    const { discussion_id } = req.params;

    db.query(
        "DELETE FROM UserDiscussionLikes WHERE user_id = ? AND discussion_id = ?",
        [user_id, discussion_id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Failed to unlike discussion" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: "Like record not found" });
            }
            res.json({ message: "Discussion unliked successfully" });
        }
    );
});

// 🔹 获取某个讨论的详细信息（包含点赞用户）
router.get("/:discussion_id/details", (req, res) => {
    const { discussion_id } = req.params;

    const discussionQuery = `
        SELECT d.discussion_id, u.username, p.title AS problem_title, d.content, d.created_at
        FROM Discussion d
        JOIN User u ON d.user_id = u.user_id
        JOIN Problem p ON d.problem_id = p.problem_id
        WHERE d.discussion_id = ?;
    `;

    const likesQuery = `
        SELECT u.user_id, u.username
        FROM UserDiscussionLikes l
        JOIN User u ON l.user_id = u.user_id
        WHERE l.discussion_id = ?;
    `;

    db.query(discussionQuery, [discussion_id], (err, discussionResults) => {
        if (err) {
            return res.status(500).json({ error: "Failed to retrieve discussion details" });
        }
        if (discussionResults.length === 0) {
            return res.status(404).json({ error: "Discussion not found" });
        }

        db.query(likesQuery, [discussion_id], (err, likesResults) => {
            if (err) {
                return res.status(500).json({ error: "Failed to retrieve discussion likes" });
            }

            res.json({
                discussion: discussionResults[0],
                liked_by: likesResults
            });
        });
    });
});

module.exports = router;