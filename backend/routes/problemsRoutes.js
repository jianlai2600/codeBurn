const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 获取所有问题
router.get("/", (req, res) => {
    db.query("SELECT * FROM Problem", (err, results) => {
        if (err) res.status(500).json({ error: "Failed to retrieve problems" });
        else res.json(results);
    });
});

// 获取指定ID问题
router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM Problem WHERE problem_id = ?", [id], (err, results) => {
        if (err) res.status(500).json({ error: "Failed to retrieve problem" });
        else res.json(results[0]);
    });
});

// 通过 Title 搜索问题
router.get("/title/:title", (req, res) => {
    const { title } = req.params;
    db.query("SELECT * FROM Problem WHERE title LIKE ?", [`%${title}%`], (err, results) => {
        if (err) res.status(500).json({ error: "Failed to retrieve problem by title" });
        else res.json(results);
    });
});

// 添加问题
router.post("/", (req, res) => {
    console.log("📥 Received POST request:", req.body);

    const { title, difficulty, url } = req.body;

    if (!title || !difficulty || !url) {
        console.error("⚠️ Missing required fields");
        return res.status(400).json({ error: "All fields are required!" });
    }

    db.query("INSERT INTO Problem (title, difficulty, url) VALUES (?, ?, ?)",
        [title, difficulty, url], 
        (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    if (err.sqlMessage.includes("title")) {
                        console.error("❌ Duplicate Title Error:", err);
                        return res.status(400).json({ error: "Title already exists!" });
                    }
                    return res.status(400).json({ error: "Duplicate entry!" });
                }
                console.error("❌ Database Insert Error:", err);
                return res.status(500).json({ error: "Database error", details: err });
            }
            res.json({ message: "Problem added successfully", problem_id: result.insertId });
        }
    );
});

// 删除问题
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM Problem WHERE problem_id = ?", [id], (err) => {
        if (err) res.status(500).json({ error: "Failed to delete problem" });
        else res.json({ message: "Problem deleted" });
    });
});

// 更新问题
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { title, difficulty, url } = req.body;
    db.query("UPDATE Problem SET title = ?, difficulty = ?, url = ? WHERE problem_id = ?", 
        [title, difficulty, url, id], 
        (err) => {
            if (err) res.status(500).json({ error: "Failed to update problem" });
            else res.json({ message: "Problem updated" });
        }
    );
});

module.exports = router;
