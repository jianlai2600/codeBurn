const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🔹 Get all problem-company relationships
router.get("/", (req, res) => {
    db.query("SELECT * FROM AppearsIn", (err, results) => {
        if (err) res.status(500).json({ error: "Failed to retrieve problem-company relationships" });
        else res.json(results);
    });
});

// 🔹 Get companies that have asked a specific problem
router.get("/problem/:problem_id", (req, res) => {
    const { problem_id } = req.params;
    db.query(
        "SELECT Company.company_name FROM AppearsIn JOIN Company ON AppearsIn.company_id = Company.company_id WHERE AppearsIn.problem_id = ?",
        [problem_id],
        (err, results) => {
            if (err) res.status(500).json({ error: "Failed to retrieve companies for this problem" });
            else res.json(results);
        }
    );
});

// 🔹 Get problems asked by a specific company
router.get("/company/:company_id", (req, res) => {
    const { company_id } = req.params;
    db.query(
        "SELECT Problem.title FROM AppearsIn JOIN Problem ON AppearsIn.problem_id = Problem.problem_id WHERE AppearsIn.company_id = ?",
        [company_id],
        (err, results) => {
            if (err) res.status(500).json({ error: "Failed to retrieve problems for this company" });
            else res.json(results);
        }
    );
});

// 🔹 Associate a problem with a company
router.post("/", (req, res) => {
    const { problem_id, company_id } = req.body;
    db.query(
        "INSERT INTO AppearsIn (problem_id, company_id) VALUES (?, ?)",
        [problem_id, company_id],
        (err, results) => {
            if (err) res.status(500).json({ error: "Failed to associate problem with company" });
            else res.json({ message: "Problem successfully associated with company" });
        }
    );
});

// 🔹 Remove an association between a problem and a company
router.delete("/", (req, res) => {
    const { problem_id, company_id } = req.body;
    db.query(
        "DELETE FROM AppearsIn WHERE problem_id = ? AND company_id = ?",
        [problem_id, company_id],
        (err, results) => {
            if (err) res.status(500).json({ error: "Failed to remove problem-company association" });
            else res.json({ message: "Problem-company association removed successfully" });
        }
    );
});

module.exports = router;