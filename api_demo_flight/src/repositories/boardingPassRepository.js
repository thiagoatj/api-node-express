const pool = require('../config/db');

async function findAll() {
  const [rows] = await pool.query('SELECT * FROM boarding_pass');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM boarding_pass WHERE boarding_pass_id = ?', [id]);
  return rows[0] || null;
}

async function findAllWithDetails() {
  const [rows] = await pool.query(`
    SELECT
      bp.boarding_pass_id AS boarding_pass_id,
      bp.seat_number AS seat_number,
      bp.issue_time AS issue_time,
      p.first_name AS passenger_first_name,
      p.last_name AS passenger_last_name,
      p.birth_date AS passenger_birth_date,
      p.passport_number AS passenger_passport_number,
      f.flight_number AS flight_number,
      f.departure_airport AS departure_airport,
      f.arrival_airport AS arrival_airport,
      f.departure_time AS departure_time,
      f.arrival_time AS arrival_time,
      a.model AS aircraft_model,
      a.manufacturer AS aircraft_manufacturer,
      a.capacity AS aircraft_capacity
    FROM boarding_pass bp
    JOIN passenger p ON bp.passenger_id = p.passenger_id
    JOIN flight f ON bp.flight_id = f.flight_id
    JOIN aircraft a ON f.aircraft_id = a.aircraft_id
    ORDER BY bp.boarding_pass_id
  `);
  return rows;
}

module.exports = { findAll, findById, findAllWithDetails };

