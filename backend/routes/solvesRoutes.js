const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🔹 Get all solve records
router.get("/", (req, res) => {
    db.query("SELECT * FROM Solves", (err, results) => {
        if (err) res.status(500).json({ error: "Failed to retrieve solve records" });
        else res.json(results);
    });
});

// 🔹 Add a new solve record
router.post("/", (req, res) => {
    const { user_id, problem_id, solve_date, status, attempts } = req.body;
    db.query("INSERT INTO Solves (user_id, problem_id, solve_date, status, attempts) VALUES (?, ?, ?, ?, ?)",
        [user_id, problem_id, solve_date, status, attempts],
        (err, results) => {
            if (err) res.status(500).json({ error: "Failed to add solve record" });
            else res.json({ message: "Solve record added successfully", id: results.insertId });
        });
});

module.exports = router;