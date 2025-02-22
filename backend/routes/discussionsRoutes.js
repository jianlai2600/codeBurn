const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🔹 Get all discussions
router.get("/", (req, res) => {
    db.query("SELECT * FROM Discussion", (err, results) => {
        if (err) res.status(500).json({ error: "Failed to retrieve discussions" });
        else res.json(results);
    });
});

// 🔹 Add a new discussion
router.post("/", (req, res) => {
    const { user_id, problem_id, content } = req.body;
    db.query("INSERT INTO Discussion (user_id, problem_id, content) VALUES (?, ?, ?)",
        [user_id, problem_id, content],
        (err, results) => {
            if (err) res.status(500).json({ error: "Failed to add discussion" });
            else res.json({ message: "Discussion added successfully", id: results.insertId });
        });
});

module.exports = router;