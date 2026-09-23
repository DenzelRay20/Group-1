// Optional: protect any route by adding `authenticateToken` before its
// controller, e.g.:
//   const { authenticateToken } = require('../middleware/authMiddleware');
//   router.get('/students', authenticateToken, getAllStudents);
// Not applied anywhere by default, so existing routes keep working as-is.
const jwt = require('jsonwebtoken');

const authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return response.status(401).json({ error: "Access token is required" });
    }

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, payload) => {
        if (err) {
            return response.status(403).json({ error: "Invalid or expired access token" });
        }
        request.user = payload;
        next();
    });
};

module.exports = { authenticateToken };
