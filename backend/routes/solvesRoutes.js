const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 获取所有解题记录
router.get("/", (req, res) => {
    db.query("SELECT * FROM Solves", (err, results) => {
        if (err) {
            console.error("❌ Error fetching solves:", err);
            return res.status(500).json({ error: "Failed to retrieve solves" });
        }
        res.json(results);
    });
});

// 按 Solve ID 搜索（返回单条记录）
router.get("/id/:solve_id", (req, res) => {
    const { solve_id } = req.params;
    const sql = "SELECT * FROM Solves WHERE solve_id = ?";
    db.query(sql, [solve_id], (err, result) => {
        if (err) {
            console.error("Error fetching solve record:", err);
            res.status(500).json({ error: "Database error" });
        } else if (result.length === 0) {
            res.status(404).json({ error: "Solve record not found" });
        } else {
            res.json(result[0]);
        }
    });
});

// 按 User ID 搜索（返回多个记录）
router.get("/user/:user_id", (req, res) => {
    const { user_id } = req.params;
    const sql = "SELECT * FROM Solves WHERE user_id = ?";
    db.query(sql, [user_id], (err, result) => {
        if (err) {
            console.error("Error fetching solve records by user:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(result);
        }
    });
});

// 按 Problem ID 搜索（返回多个记录）
router.get("/problem/:problem_id", (req, res) => {
    const { problem_id } = req.params;
    const sql = "SELECT * FROM Solves WHERE problem_id = ?";
    db.query(sql, [problem_id], (err, result) => {
        if (err) {
            console.error("Error fetching solve records by problem:", err);
            res.status(500).json({ error: "Database error" });
        } else {
            res.json(result);
        }
    });
});


// 添加解题记录
router.post("/", (req, res) => {
    console.log("📥 Received POST request:", req.body);

    const { user_id, problem_id, solve_date, attempts, status } = req.body;

    if (!user_id || !problem_id || !solve_date || !attempts || !status) {
        console.error("⚠️ Missing required fields");
        return res.status(400).json({ error: "All fields are required!" });
    }

    db.query(
        "INSERT INTO Solves (user_id, problem_id, solve_date, attempts, status) VALUES (?, ?, ?, ?, ?)",
        [user_id, problem_id, solve_date, attempts, status],
        (err, result) => {
            if (err) {
                console.error("❌ Error inserting solve:", err);
                return res.status(500).json({ error: "Database error", details: err });
            }
            res.json({ message: "Solve added successfully", solve_id: result.insertId });
        }
    );
});

// 删除解题记录
router.delete("/:solveId", (req, res) => {
    const { solveId } = req.params;
    db.query("DELETE FROM Solves WHERE solve_id = ?", [solveId], (err) => {
        if (err) {
            console.error("❌ Error deleting solve:", err);
            return res.status(500).json({ error: "Failed to delete solve" });
        }
        res.json({ message: "Solve deleted successfully" });
    });
});

// 更新解题记录
router.put("/:solveId", (req, res) => {
    const { solveId } = req.params;
    const { solve_date, attempts, status } = req.body;

    db.query(
        "UPDATE Solves SET solve_date = ?, attempts = ?, status = ? WHERE solve_id = ?",
        [solve_date, attempts, status, solveId],
        (err) => {
            if (err) {
                console.error("❌ Error updating solve:", err);
                return res.status(500).json({ error: "Failed to update solve" });
            }
            res.json({ message: "Solve updated successfully" });
        }
    );
});

module.exports = router;