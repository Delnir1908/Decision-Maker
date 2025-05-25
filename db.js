const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

async function getPollById(pollId) {
  const res = await pool.query('SELECT * FROM polls WHERE id = $1', [pollId]);
  return res.rows[0];
}


module.exports = {pool, getPollById,};
