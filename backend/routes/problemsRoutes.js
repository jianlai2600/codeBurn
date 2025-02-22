const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🔹 Get all problems
router.get("/", (req, res) => {
    db.query("SELECT * FROM Problem", (err, results) => {
        if (err) res.status(500).json({ error: "Failed to retrieve problems" });
        else res.json(results);
    });
});

// 🔹 Add a new problem
router.post("/", (req, res) => {
    const { title, difficulty, url } = req.body;
    db.query("INSERT INTO Problem (title, difficulty, url) VALUES (?, ?, ?)",
        [title, difficulty, url],
        (err, results) => {
            if (err) res.status(500).json({ error: "Failed to add problem" });
            else res.json({ message: "Problem added successfully", id: results.insertId });
        });
});

module.exports = router;