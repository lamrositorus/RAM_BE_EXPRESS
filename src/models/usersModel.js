const db = require('../config/database');

module.exports = {
  createUser: async ({ username, email, password }) => {
    const result = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, password]
    );
    return result.rows[0];
  },

  getUserByEmail: async (email) => {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  getUserById: async (id) => {
    const result = await db.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  updateUser: async (id, { username, email }) => {
    const result = await db.query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email, created_at',
      [username, email, id]
    );
    return result.rows[0];
  },

  deleteUser: async (id) => {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
  },

  getAllUsers: async (page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    const result = await db.query(
      'SELECT id, username, email, created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }
};