const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🔹 Get all companies
router.get("/", (req, res) => {
    db.query("SELECT * FROM Company", (err, results) => {
        if (err) res.status(500).json({ error: "Failed to retrieve companies" });
        else res.json(results);
    });
});

// 🔹 Add a new company
router.post("/", (req, res) => {
    const { company_name } = req.body;
    db.query("INSERT INTO Company (company_name) VALUES (?)",
        [company_name],
        (err, results) => {
            if (err) res.status(500).json({ error: "Failed to add company" });
            else res.json({ message: "Company added successfully", id: results.insertId });
        });
});

module.exports = router;