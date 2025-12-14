const express = require('express');
const router = express.Router();


const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Gerçek kullanıcı kaydı
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: 'Email ve şifre zorunlu' });
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ success: false, error: 'Email zaten kayıtlı' });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });
    res.json({ success: true, userId: user._id });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Gerçek kullanıcı girişi
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, error: 'Email ve şifre zorunlu' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, error: 'Kullanıcı bulunamadı' });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, error: 'Şifre hatalı' });
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
