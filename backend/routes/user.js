const express = require('express');
const router = express.Router();


const User = require('../models/User');
// Gerçek kullanıcı bilgisi endpointi (JWT ile kimlik doğrulama gerektirir)
const authMiddleware = require('../middleware/auth');
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -resetToken -verifyToken');
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Veri alınamadı', details: err.message });
  }
});

module.exports = router;
