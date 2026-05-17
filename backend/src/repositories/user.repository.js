const pool = require('../config/db');

const createUser = async (userData) => {
  const { login_id, email, password_hash, nickname, birth_date } = userData;
  const query = `
    INSERT INTO users (login_id, email, password_hash, nickname, birth_date)
    VALUES ($1, $2, $3, $4, $5) RETURNING user_id;
  `;
  const values = [login_id, email, password_hash, nickname, birth_date];
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = { createUser };