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

// 添加用户
router.post("/", (req, res) => {
    console.log("📥 Received POST request:", req.body);

    const { username, email, avatar_url } = req.body;

    if (!username || !email || !avatar_url) {
        console.error("⚠️ Missing required fields");
        return res.status(400).json({ error: "All fields are required!" });
    }

    db.query("INSERT INTO User (username, email, avatar_url) VALUES (?, ?, ?)",
        [username, email, avatar_url], 
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    if (err.sqlMessage.includes("username")) {
                        console.error("❌ Duplicate Username Error:", err);
                        return res.status(400).json({ error: "Username already exists!" });
                    } else if (err.sqlMessage.includes("email")) {
                        console.error("❌ Duplicate Email Error:", err);
                        return res.status(400).json({ error: "Email already exists!" });
                    }
                    return res.status(400).json({ error: "Duplicate entry!" });
                }
                console.error("❌ Database Insert Error:", err);
                return res.status(500).json({ error: "Database error", details: err });
            }
            res.json({ message: "User added successfully", user_id: result.insertId });
        }
    );
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