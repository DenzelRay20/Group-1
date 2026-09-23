-- Run this once against your PostgreSQL database before starting the server:
--   psql -U <DB_USER> -d <DB_DATABASE> -f src/config/schema.sql

CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    course VARCHAR(255) NOT NULL
);

-- Seed with the same sample rows the old in-memory version used,
-- so behavior stays familiar after switching to a real database.
INSERT INTO students (name, course)
SELECT * FROM (VALUES
    ('Reign', 'BSCRIM'),
    ('Jepayb', 'BSED'),
    ('Jason', 'BSM')
) AS seed(name, course)
WHERE NOT EXISTS (SELECT 1 FROM students);

-- Auth: users + refresh tokens (added for login/register/refresh feature)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
