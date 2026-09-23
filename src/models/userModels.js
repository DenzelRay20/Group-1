// Data access for authentication: the users table and refresh_tokens table.
// See src/config/schema.sql for the table definitions.
const pool = require('../config/db');

const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
};

const findUserByUsername = async (username) => {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0] || null;
};

// Excludes password_hash on purpose — safe to send back in API responses.
const findUserById = async (id) => {
    const result = await pool.query(
        'SELECT id, username, email, created_at FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0] || null;
};

const createUser = async (username, email, passwordHash) => {
    const result = await pool.query(
        `INSERT INTO users (username, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, username, email, created_at`,
        [username, email, passwordHash]
    );
    return result.rows[0];
};

const saveRefreshToken = async (userId, token, expiresAt) => {
    await pool.query(
        'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
        [userId, token, expiresAt]
    );
};

const findRefreshToken = async (token) => {
    const result = await pool.query('SELECT * FROM refresh_tokens WHERE token = $1', [token]);
    return result.rows[0] || null;
};

const deleteRefreshToken = async (token) => {
    await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [token]);
};

module.exports = {
    findUserByEmail,
    findUserByUsername,
    findUserById,
    createUser,
    saveRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
};
