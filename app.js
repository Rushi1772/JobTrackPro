// app.js
require("dotenv").config();
const required = ["DB_HOST", "DB_USER", "DB_PASS", "DB_NAME", "JWT_SECRET"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("❌ Missing environment variables:", missing.join(", "));
  process.exit(1);
}
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

app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "JobTrackPro API is running ✅",
    endpoints: ["/db-test", "/users", "/applications", "/events"],
  });
});

app.get("/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("DB TEST ERROR:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.use("/users", userRoutes);
app.use("/applications", applicationRoutes);
app.use("/events", eventRoutes);

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.stack);
  res.status(500).json({ ok: false, message: "Internal Server Error", details: err.message });
});

(async () => {
  try {
    await initDB(); 
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Server not started (DB failed):", err.message);
    process.exit(1);
  }
})();