const pool = require('../config/db');

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM passenger');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM passenger WHERE passenger_id = ?', [id]);
  return rows[0] || null;
}

module.exports = { findAll, findById };

