const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🔹 获取关键统计信息
router.get("/", (req, res) => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM User) AS total_users,
            (SELECT COUNT(*) FROM Problem) AS total_problems,
            (SELECT COUNT(*) FROM Solves) AS total_solves;
    `;
    db.query(query, (err, results) => {
        if (err) res.status(500).json({ error: "Failed to retrieve statistics" });
        else res.json(results[0]); 
    });
});

module.exports = router;