const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🔹 Get all students
router.get("/", (req, res) => {
    db.query("SELECT * FROM User", (err, results) => {
        if (err) res.status(500).json({ error: "Failed to retrieve users" });
        else res.json(results);
    });
});

// 🔹 Get a specific student by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM User WHERE user_id = ?", [id], (err, results) => {
        if (err) res.status(500).json({ error: "Failed to retrieve users" });
        else res.json(results[0]);
    });
});

module.exports = router;
