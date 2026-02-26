// app.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/users");
const applicationRoutes = require("./routes/applications");
const eventRoutes = require("./routes/events");

const { pool, initDB } = require("./config/database");

const app = express();
const PORT = process.env.PORT || 4000;

// =====================
// Middleware
// =====================
app.use(cors());
app.use(express.json());

// =====================
// Root / Health Route
// =====================
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "JobTrackPro API is running ✅",
    endpoints: {
      dbTest: "/db-test",
      users: "/users",
      applications: "/applications",
      events: "/events"
    }
  });
});

// =====================
// Database Test Route
// =====================
app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("DB TEST ERROR:", err.message);
    res.status(500).json({
      ok: false,
      error: "Database connection failed",
      details: err.message
    });
  }
});

// =====================
// API Routes
// =====================
app.use("/users", userRoutes);
app.use("/applications", applicationRoutes);
app.use("/events", eventRoutes);

// =====================
// Global Error Handler
// =====================
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.stack);
  res.status(err.status || 500).json({
    ok: false,
    message: "Internal Server Error",
    details: err.message
  });
});

// =====================
// Start Server After DB Init
// =====================
(async () => {
  try {
    if (typeof initDB === "function") {
      await initDB();
    }

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
})();