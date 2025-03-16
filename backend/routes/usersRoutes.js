const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 获取所有用户
router.get("/", (req, res) => {
    db.query("SELECT * FROM User", (err, results) => {
        if (err) res.status(500).json({ error: "Failed to retrieve users" });
        else res.json(results);
    });
});

// 获取指定ID用户
router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM User WHERE user_id = ?", [id], (err, results) => {
        if (err) res.status(500).json({ error: "Failed to retrieve user" });
        else res.json(results[0]);
    });
});

// 按 User ID 搜索
router.get("/id/:userId", (req, res) => {
    const userId = req.params.userId;
    db.query("SELECT * FROM User WHERE user_id = ?", [userId], (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: `User ID ${userId} not found!` });
        }
        res.json(results[0]);  // 仅返回一个用户
    });
});

// 按 Username 搜索
router.get("/username/:username", (req, res) => {
    const username = req.params.username;
    db.query("SELECT * FROM User WHERE username LIKE ?", [`%${username}%`], (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: `No users found with username: ${username}` });
        }
        res.json(results);  // 可能返回多个用户
    });
});

// 按 Email 搜索
router.get("/email/:email", (req, res) => {
    const email = req.params.email;
    db.query("SELECT * FROM User WHERE email LIKE ?", [`%${email}%`], (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: `No users found with email: ${email}` });
        }
        res.json(results);  // 可能返回多个用户
    });
});


// 添加用户
router.post("/", (req, res) => {
    console.log("📥 Received POST request:", req.body);

    const { username, email, avatar_url } = req.body;

    if (!username || !email || !avatar_url) {
        console.error("⚠️ Missing required fields");
        return res.status(400).json({ error: "All fields are required!" });
    }

    // 🔎 先检查 username 和 email 是否已存在
    db.query("SELECT * FROM User WHERE username = ? OR email = ?", [username, email], (err, results) => {
        if (err) {
            console.error("❌ Database Query Error:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }

        if (results.length > 0) {
            // 检查是 username 还是 email 重复
            const existingUser = results[0];
            if (existingUser.username === username) {
                return res.status(400).json({ error: "Username already exists!" });
            }
            if (existingUser.email === email) {
                return res.status(400).json({ error: "Email already exists!" });
            }
        }

        // 🔥 通过查重后，插入用户
        db.query(
            "INSERT INTO User (username, email, avatar_url) VALUES (?, ?, ?)",
            [username, email, avatar_url],
            (insertErr, result) => {
                if (insertErr) {
                    console.error("❌ Database Insert Error:", insertErr);
                    return res.status(500).json({ error: "Database error", details: insertErr });
                }
                res.json({ message: "User added successfully", user_id: result.insertId });
            }
        );
    });
});

// 删除用户
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM User WHERE user_id = ?", [id], (err) => {
        if (err) res.status(500).json({ error: "Failed to delete user" });
        else res.json({ message: "User deleted" });
    });
});

// 更新用户
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { username, email, avatar_url } = req.body;
    db.query("UPDATE User SET username = ?, email = ?, avatar_url = ? WHERE user_id = ?", 
        [username, email, avatar_url, id], 
        (err) => {
            if (err) res.status(500).json({ error: "Failed to update user" });
            else res.json({ message: "User updated" });
        }
    );
});

module.exports = router;