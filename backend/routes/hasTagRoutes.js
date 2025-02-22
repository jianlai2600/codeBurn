const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🔹 Associate problem with a tag
router.post("/", (req, res) => {
    const { problem_id, tag_id } = req.body;
    db.query("INSERT INTO HasTag (problem_id, tag_id) VALUES (?, ?)",
        [problem_id, tag_id],
        (err, results) => {
            if (err) res.status(500).json({ error: "Failed to associate tag" });
            else res.json({ message: "Tag associated successfully" });
        });
});

module.exports = router;