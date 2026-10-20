const pool = require('../config/db');

function semSenha(user) {
  const { password, ...resto } = user;
  return resto;
}

async function findAll() {
  const [rows] = await pool.query('SELECT id, name, login_email, user_type FROM sys_user');
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, name, login_email, user_type FROM sys_user WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM sys_user WHERE login_email = ?', [email]);
  return rows[0] || null;
}

async function create(data) {
  const { name, login_email, password, user_type } = data;
  const [result] = await pool.query(
    'INSERT INTO sys_user (name, login_email, password, user_type) VALUES (?, ?, ?, ?)',
    [name, login_email, password, user_type]
  );
  return result.insertId;
}

async function update(id, data) {
  const { name, login_email, password, user_type } = data;
  const [result] = await pool.query(
    'UPDATE sys_user SET name = ?, login_email = ?, password = ?, user_type = ? WHERE id = ?',
    [name, login_email, password, user_type, id]
  );
  return result.affectedRows;
}

async function updateOwn(id, data) {
  const { name, login_email, password } = data;
  const [result] = await pool.query(
    'UPDATE sys_user SET name = ?, login_email = ?, password = ? WHERE id = ?',
    [name, login_email, password, id]
  );
  return result.affectedRows;
}

async function remove(id) {
  const [result] = await pool.query('DELETE FROM sys_user WHERE id = ?', [id]);
  return result.affectedRows;
}

module.exports = { findAll, findById, findByEmail, create, update, updateOwn, remove };

