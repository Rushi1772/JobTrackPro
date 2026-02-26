// routes/events.js
const express = require("express");
const router = express.Router();

const { getPool } = require("../config/database");
const auth = require("../middleware/auth");

// Add Event (only if application belongs to logged-in user)
router.post("/", auth, async (req, res, next) => {
  try {
    const { application_id, event_type, event_date } = req.body;

    if (!application_id || !event_type || !event_date) {
      return res.status(400).json({ message: "application_id, event_type, event_date are required" });
    }

    const db = getPool();

    // Ownership check
    const [apps] = await db.query(
      "SELECT id FROM applications WHERE id = ? AND user_id = ?",
      [application_id, req.user.id]
    );

    if (apps.length === 0) {
      return res.status(403).json({ message: "You do not own this application" });
    }

    await db.query(
      "INSERT INTO events (application_id, event_type, event_date) VALUES (?, ?, ?)",
      [application_id, event_type, event_date]
    );

    res.status(201).json({ message: "Event added successfully" });
  } catch (err) {
    next(err);
  }
});

// Get Events for all applications of user
router.get("/", auth, async (req, res, next) => {
  try {
    const db = getPool();
    const [rows] = await db.query(
      `SELECT e.* FROM events e
       JOIN applications a ON a.id = e.application_id
       WHERE a.user_id = ?
       ORDER BY e.id DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// DELETE event (ownership enforced)
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const eventId = Number(req.params.id);
    const db = getPool();

    const [result] = await db.query(
      `DELETE e FROM events e
       JOIN applications a ON a.id = e.application_id
       WHERE e.id = ? AND a.user_id = ?`,
      [eventId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
