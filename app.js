// app.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/users");
const applicationRoutes = require("./routes/applications");
const eventRoutes = require("./routes/events");

const { pool, initDB } = require("./config/database");

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ Required env vars check 
const required = ["DB_HOST", "DB_USER", "DB_PASS", "DB_NAME", "JWT_SECRET"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("❌ Missing environment variables:", missing.join(", "));
  process.exit(1);
}

app.use(cors());
app.use(express.json());

// ✅ Serve static files from public directory (built React app)
app.use(express.static('public'));

// ✅ Root route - serve React app for all non-API routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ API routes
app.get("/api", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "JobTrackPro API is running ✅",
    endpoints: ["/api/db-test", "/api/users", "/api/applications", "/api/events"],
  });
});

// ✅ DB test route
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error("DB TEST ERROR:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/events", eventRoutes);

// ✅ Catch all handler: send back React's index.html for client-side routing (excluding API routes)
app.get(/^\/(?!api).*/, (req, res) => {
  const indexPath = path.join(__dirname, 'public', 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend not built. Please run: npm run build');
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err.stack);
  res.status(500).json({
    ok: false,
    message: "Internal Server Error",
    details: err.message,
  });
});

// Start server only after DB works
(async () => {
  try {
    console.log("🔌 Attempting DB connection to:", process.env.DB_HOST, "port:", process.env.DB_PORT || 3306);

    // ✅ 1) Confirm DB connection works
    await pool.query("SELECT 1");
    console.log("✅ DB connected");

    // ✅ 2) Create tables
    await initDB();
    console.log("✅ Tables ensured");

    // ✅ 3) Start server
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error("❌ Server not started (DB failed):", err.message);
    process.exit(1);
  }
})();