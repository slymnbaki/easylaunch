
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const sendMail = require('../utils/mailer');

// Basit KYC başvuru endpointi
router.post('/submit', async (req, res) => {
  const { email, name, idNumber } = req.body;
  if (!email || !name || !idNumber) return res.status(400).json({ error: 'Eksik bilgi' });
  await User.updateOne({ email }, { $set: { kyc: { name, idNumber, status: 'pending' } } }, { upsert: true });
  res.json({ success: true, message: 'KYC başvurusu alındı' });
});

// Admin için KYC onay/reddet
router.post('/review', async (req, res) => {
  const { email, status } = req.body;
  if (!email || !['approved','rejected'].includes(status)) return res.status(400).json({ error: 'Eksik veya hatalı bilgi' });
  await User.updateOne({ email }, { $set: { 'kyc.status': status } });
  // E-posta bildirimi gönder
  try {
    await sendMail(email, 'KYC Sonucu', `KYC başvurunuz: ${status === 'approved' ? 'Onaylandı' : 'Reddedildi'}`);
  } catch {}
  res.json({ success: true, message: `KYC ${status}` });
});

module.exports = router;
