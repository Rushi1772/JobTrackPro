// routes/applications.js
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const auth = require("../middleware/auth");

// Add Application
router.post("/", auth, async (req, res, next) => {
  try {
    const { company, role, status, applied_date } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: "company and role are required" });
    }

    await pool.query(
      "INSERT INTO applications (user_id, company, role, status, applied_date) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, company, role, status || "applied", applied_date || null]
    );

    return res.status(201).json({ message: "Application added successfully" });
  } catch (err) {
    next(err);
  }
});

// Get all Applications for user
router.get("/", auth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM applications WHERE user_id = ? ORDER BY id DESC",
      [req.user.id]
    );
    return res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

// DELETE application
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const appId = Number(req.params.id);

    const [result] = await pool.query(
      "DELETE FROM applications WHERE id = ? AND user_id = ?",
      [appId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json({ message: "Application deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;