const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');

// API key oluştur
router.post('/generate', async (req, res) => {
  const { email } = req.body;
  const apiKey = crypto.randomBytes(24).toString('hex');
  await User.updateOne({ email }, { $set: { apiKey } }, { upsert: true });
  res.json({ apiKey });
});
// API key ile doğrulama
router.post('/verify', async (req, res) => {
  const { email, apiKey } = req.body;
  const user = await User.findOne({ email });
  res.json({ valid: user?.apiKey === apiKey });
});
module.exports = router;
