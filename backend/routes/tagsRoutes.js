const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🔹 Get all tags
router.get("/", (req, res) => {
    db.query("SELECT * FROM Tag", (err, results) => {
        if (err) res.status(500).json({ error: "Failed to retrieve tags" });
        else res.json(results);
    });
});

// 🔹 Add a new tag
router.post("/", (req, res) => {
    const { tag_name } = req.body;
    db.query("INSERT INTO Tag (tag_name) VALUES (?)",
        [tag_name],
        (err, results) => {
            if (err) res.status(500).json({ error: "Failed to add tag" });
            else res.json({ message: "Tag added successfully", id: results.insertId });
        });
});

module.exports = router;