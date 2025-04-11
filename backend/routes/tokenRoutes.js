const express = require("express");
const router = express.Router();
const axios = require("axios");
const db = require("../config/db"); // 你的 MySQL 连接

// POST /api/google-login
router.post("/", async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ error: "Missing token" });
    }

    try {
        // 🔁 向 Google 请求用户信息
        const googleRes = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const user = googleRes.data;
        console.log("✅ Google 用户信息:", user);

        // 🔐 插入或更新到 user_logins 表
        const query = `
            INSERT INTO user_logins (google_id, name, email, picture)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                email = VALUES(email),
                picture = VALUES(picture),
                login_time = CURRENT_TIMESTAMP;
        `;

        db.query(
            query,
            [user.sub, user.name, user.email, user.picture],
            (err, results) => {
                if (err) {
                    console.error("❌ 插入数据库失败:", err);
                    return res.status(500).json({ error: "Database insert error" });
                }

                // 返回前端可用的用户信息
                res.json({
                    google_id: user.sub,
                    name: user.name,
                    email: user.email,
                    picture: user.picture,
                });
            }
        );
    } catch (err) {
        console.error("❌ 获取 Google 用户信息失败:", err);
        res.status(500).json({ error: "Failed to fetch Google user info" });
    }
});

module.exports = router;