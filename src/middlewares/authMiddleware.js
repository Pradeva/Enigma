const { verifyToken } = require('../utils/jwt');

exports.authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized'});
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
    }
};