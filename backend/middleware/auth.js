const jwt = require('jsonwebtoken');

module.exports = (roles = []) => {
  // roles: ['admin', 'user'] gibi
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token eksik' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: 'Yetkisiz erişim' });
      }
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: 'Token geçersiz' });
    }
  };
};
