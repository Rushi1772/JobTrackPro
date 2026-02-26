// routes/applications.js
const express = require("express");
const router = express.Router();

const { getPool } = require("../config/database");
const auth = require("../middleware/auth");

// Add Application
router.post("/", auth, async (req, res, next) => {
  try {
    const { company, role, status, applied_date } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: "company and role are required" });
    }

    const db = getPool();

    await db.query(
      "INSERT INTO applications (user_id, company, role, status, applied_date) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, company, role, status || "applied", applied_date || null]
    );

    res.status(201).json({ message: "Application added successfully" });
  } catch (err) {
    next(err);
  }
});

// Get all Applications for user
router.get("/", auth, async (req, res, next) => {
  try {
    const db = getPool();
    const [rows] = await db.query(
      "SELECT * FROM applications WHERE user_id = ? ORDER BY id DESC",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// DELETE application (✅ was broken before)
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const appId = Number(req.params.id);
    const db = getPool();

    const [result] = await db.query(
      "DELETE FROM applications WHERE id = ? AND user_id = ?",
      [appId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
