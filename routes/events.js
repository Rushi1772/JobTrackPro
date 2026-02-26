// routes/events.js
const express = require("express");
const router = express.Router();

const { pool } = require("../config/database");
const auth = require("../middleware/auth");

// ✅ CREATE event (POST /events)
router.post("/", auth, async (req, res, next) => {
  try {
    const { application_id, event_type, event_date, notes } = req.body || {};

    if (!application_id || !event_type || !event_date) {
      return res.status(400).json({
        message: "application_id, event_type, and event_date are required",
      });
    }

    // ensure the application belongs to this user
    const [apps] = await pool.query(
      "SELECT id FROM applications WHERE id = ? AND user_id = ?",
      [application_id, req.user.id]
    );
    if (apps.length === 0) {
      return res.status(404).json({ message: "Application not found for this user" });
    }

    const [result] = await pool.query(
      "INSERT INTO events (user_id, application_id, event_type, event_date, notes) VALUES (?, ?, ?, ?, ?)",
      [req.user.id, application_id, event_type, event_date, notes || null]
    );

    return res.status(201).json({
      message: "Event added successfully",
      id: result.insertId,
    });
  } catch (err) {
    next(err);
  }
});

// ✅ READ all events (GET /events)
router.get("/", auth, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT e.*
       FROM events e
       WHERE e.user_id = ?
       ORDER BY e.id DESC`,
      [req.user.id]
    );
    return res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

// ✅ READ one event (GET /events/:id)
router.get("/:id", auth, async (req, res, next) => {
  try {
    const eventId = Number(req.params.id);

    const [rows] = await pool.query(
      "SELECT * FROM events WHERE id = ? AND user_id = ?",
      [eventId, req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

// ✅ UPDATE event (PUT /events/:id)
router.put("/:id", auth, async (req, res, next) => {
  try {
    const eventId = Number(req.params.id);
    const { application_id, event_type, event_date, notes } = req.body || {};

    // if application_id provided, verify it belongs to user
    if (application_id) {
      const [apps] = await pool.query(
        "SELECT id FROM applications WHERE id = ? AND user_id = ?",
        [application_id, req.user.id]
      );
      if (apps.length === 0) {
        return res.status(404).json({ message: "Application not found for this user" });
      }
    }

    const [result] = await pool.query(
      `UPDATE events
       SET application_id = COALESCE(?, application_id),
           event_type = COALESCE(?, event_type),
           event_date = COALESCE(?, event_date),
           notes = COALESCE(?, notes)
       WHERE id = ? AND user_id = ?`,
      [application_id || null, event_type || null, event_date || null, notes || null, eventId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ message: "Event updated successfully" });
  } catch (err) {
    next(err);
  }
});

// ✅ DELETE event (DELETE /events/:id)
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const eventId = Number(req.params.id);

    const [result] = await pool.query(
      "DELETE FROM events WHERE id = ? AND user_id = ?",
      [eventId, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ message: "Event deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;