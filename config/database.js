// config/database.js
require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS || process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function columnExists(table, column) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS c
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [table, column]
  );
  return rows[0].c > 0;
}

async function tableExists(table) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS c
     FROM INFORMATION_SCHEMA.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?`,
    [table]
  );
  return rows[0].c > 0;
}

async function initDB() {
  // 1) test connection
  await pool.query("SELECT 1");

  // 2) USERS: handle old schema safely
  const usersExists = await tableExists("users");

  if (usersExists) {
    const hasId = await columnExists("users", "id");
    if (!hasId) {
      // Rename old users table so it doesn’t break the app
      const stamp = new Date()
        .toISOString()
        .replace(/[-:.TZ]/g, "")
        .slice(0, 14);
      const oldName = `users_old_${stamp}`;
      await pool.query(`RENAME TABLE users TO ${oldName}`);
      console.log(`⚠️ Renamed old users table -> ${oldName} (missing id column)`);
    }
  }

  // 3) Create correct USERS table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 4) Create APPLICATIONS table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT NOT NULL,
      company VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'applied',
      applied_date DATE NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // 5) Create EVENTS table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id INT PRIMARY KEY AUTO_INCREMENT,
      application_id INT NOT NULL,
      event_type VARCHAR(255) NOT NULL,
      event_date DATE NOT NULL,
      FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
    )
  `);

  console.log("✅ Database ready (tables created/verified)");
}

module.exports = { pool, initDB };

ssl: {
  rejectUnauthorized: false
}