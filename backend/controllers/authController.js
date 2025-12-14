const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email ve şifre zorunlu' });
  const user = await User.findOne({ email });
  if (!user || user.password !== password) return res.status(401).json({ error: 'Geçersiz giriş' });
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '2h' });
  res.json({ token, user: { email: user.email, role: user.role } });
};

exports.verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token eksik' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    res.json({ valid: true, decoded });
  } catch (err) {
    res.status(401).json({ valid: false, error: 'Token geçersiz' });
  }
};
