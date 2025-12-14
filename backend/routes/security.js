const express = require('express');
const router = express.Router();
const User = require('../models/User');
const speakeasy = require('speakeasy');

// 2FA setup (kullanıcıya secret üret)
router.post('/2fa/setup', async (req, res) => {
  const { email } = req.body;
  const secret = speakeasy.generateSecret();
  await User.updateOne({ email }, { $set: { 'security.otpSecret': secret.base32 } }, { upsert: true });
  res.json({ otpauth_url: secret.otpauth_url, base32: secret.base32 });
});

// 2FA doğrulama
router.post('/2fa/verify', async (req, res) => {
  const { email, token } = req.body;
  const user = await User.findOne({ email });
  if (!user?.security?.otpSecret) return res.status(400).json({ error: '2FA aktif değil' });
  const verified = speakeasy.totp.verify({
    secret: user.security.otpSecret,
    encoding: 'base32',
    token
  });
  res.json({ verified });
});

module.exports = router;
