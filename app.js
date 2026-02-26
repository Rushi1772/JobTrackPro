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

app.use(cors());
app.use(express.json());

// ✅ Root route
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "JobTrackPro API is running ✅",
    endpoints: ["/db-test", "/users", "/applications", "/events"],
  });
});

// ✅ DB test route
app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json(rows[0]);
  } catch (err) {
    console.error("DB TEST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
// Health / Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "JobTrackPro API"
  });
});
// Routes
app.use("/users", userRoutes);
app.use("/applications", applicationRoutes);
app.use("/events", eventRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

// ✅ Start after DB init (only once)
(async () => {
  try {
    if (typeof initDB === "function") {
      await initDB();
    }
    console.log("🔥 RUNNING app.js build:", new Date().toISOString());
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Server not started because DB failed:", err.message);
    process.exit(1);
  }
})();