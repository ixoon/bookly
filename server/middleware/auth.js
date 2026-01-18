
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) {
        return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = data.userId;
        next();
    } catch {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
}