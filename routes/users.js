// routes/users.js
const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");

// quick ping
router.get("/ping", (req, res) => {
  res.json({ message: "users route working" });
});

// REGISTER (returns user + token)
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET missing in .env" });
    }

    // ensure users table exists (better to do in initDB, but keeping here for safety)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // prevent duplicate email
    const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // insert
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashed]
    );

    const user = { id: result.insertId, name, email };

    // auto-login token
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "2h" });

    return res.status(201).json({
      message: "User registered successfully",
      user,
      token
    });
  } catch (err) {
    console.error("❌ REGISTER ERROR:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// LOGIN (returns user + token)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET missing in .env" });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "User not found" });

    const dbUser = rows[0];
    const match = await bcrypt.compare(password, dbUser.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const user = { id: dbUser.id, name: dbUser.name, email: dbUser.email };

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "2h" });

    return res.json({ token, user });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

module.exports = router;
