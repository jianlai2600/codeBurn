const express = require("express");
const router = express.Router();
const db = require("../config/db");

// 🔹 Get all users
router.get("/", (req, res) => {
    db.query("SELECT * FROM User", (err, results) => {
        if (err) res.status(500).json({ error: "Failed to retrieve users" });
        else res.json(results);
    });
});

// 🔹 Get a specific user by ID
router.get("/:id", (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM User WHERE user_id = ?", [id], (err, results) => {
        if (err) res.status(500).json({ error: "Failed to retrieve user" });
        else res.json(results[0]);
    });
});

// 🔹 Add a new user
router.post("/", (req, res) => {
    const { username, email, password, avatar_url } = req.body;
    db.query("INSERT INTO User (username, email, password, avatar_url) VALUES (?, ?, ?, ?)",
        [username, email, password, avatar_url],
        (err, results) => {
            if (err) res.status(500).json({ error: "Failed to add user" });
            else res.json({ message: "User added successfully", id: results.insertId });
        });
});

// 🔹 Update user information
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { username, email, avatar_url } = req.body;
    db.query("UPDATE User SET username = ?, email = ?, avatar_url = ? WHERE user_id = ?",
        [username, email, avatar_url, id],
        (err, results) => {
            if (err) res.status(500).json({ error: "Failed to update user" });
            else res.json({ message: "User updated successfully" });
        });
});

// 🔹 Delete a user
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM User WHERE user_id = ?", [id], (err, results) => {
        if (err) res.status(500).json({ error: "Failed to delete user" });
        else res.json({ message: "User deleted successfully" });
    });
});

module.exports = router;