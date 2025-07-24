const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userData = { userId: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};
