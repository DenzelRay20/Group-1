const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
    findUserByEmail,
    findUserByUsername,
    findUserById,
    createUser,
    saveRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
} = require('../models/userModels');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const REFRESH_TOKEN_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 7);

const generateAccessToken = (user) =>
    jwt.sign({ sub: user.id, username: user.username }, ACCESS_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES,
    });

const generateRefreshToken = (user) =>
    jwt.sign({ sub: user.id }, REFRESH_SECRET, { expiresIn: `${REFRESH_TOKEN_DAYS}d` });

const register = async (request, response) => {
    try {
        const { username, email, password } = request.body;

        if (!username || !email || !password) {
            return response.status(400).json({ error: "username, email and password are required" });
        }
        if (password.length < 6) {
            return response.status(400).json({ error: "password must be at least 6 characters" });
        }

        if (await findUserByEmail(email)) {
            return response.status(409).json({ error: "Email is already registered" });
        }
        if (await findUserByUsername(username)) {
            return response.status(409).json({ error: "Username is already taken" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await createUser(username, email, passwordHash);

        response.status(201).json({ user });
    } catch (error) {
        console.error("Error registering user:", error.message);
        response.status(500).json({ error: "Failed to register user" });
    }
};

const login = async (request, response) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({ error: "email and password are required" });
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return response.status(401).json({ error: "Invalid email or password" });
        }

        const passwordMatches = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatches) {
            return response.status(401).json({ error: "Invalid email or password" });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
        await saveRefreshToken(user.id, refreshToken, expiresAt);

        response.json({
            accessToken,
            refreshToken,
            user: { id: user.id, username: user.username, email: user.email },
        });
    } catch (error) {
        console.error("Error logging in:", error.message);
        response.status(500).json({ error: "Failed to log in" });
    }
};

const refresh = async (request, response) => {
    try {
        const { refreshToken } = request.body;
        if (!refreshToken) {
            return response.status(400).json({ error: "refreshToken is required" });
        }

        const stored = await findRefreshToken(refreshToken);
        if (!stored) {
            return response.status(403).json({ error: "Refresh token not recognized" });
        }
        if (new Date(stored.expires_at) < new Date()) {
            await deleteRefreshToken(refreshToken);
            return response.status(403).json({ error: "Refresh token expired, please log in again" });
        }

        jwt.verify(refreshToken, REFRESH_SECRET, async (err, payload) => {
            if (err) {
                return response.status(403).json({ error: "Invalid refresh token" });
            }

            const user = await findUserById(payload.sub);
            if (!user) {
                return response.status(404).json({ error: "User not found" });
            }

            const accessToken = generateAccessToken(user);
            response.json({ accessToken });
        });
    } catch (error) {
        console.error("Error refreshing token:", error.message);
        response.status(500).json({ error: "Failed to refresh token" });
    }
};

const logout = async (request, response) => {
    try {
        const { refreshToken } = request.body;
        if (refreshToken) {
            await deleteRefreshToken(refreshToken);
        }
        response.json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error logging out:", error.message);
        response.status(500).json({ error: "Failed to log out" });
    }
};

module.exports = { register, login, refresh, logout };
