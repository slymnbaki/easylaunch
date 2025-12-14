const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');


// Admin dashboard summary
router.get('/', async (req, res) => {
  try {
    const stats = await adminController.getStatsRaw();
    res.json({ success: true, ...stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/stats', adminController.getStats);

router.get('/users', async (req, res) => {
  const users = await User.find({});
  res.json({ success: true, users });
});

router.get('/admins', async (req, res) => {
  const admins = await User.find({ role: 'admin' });
  res.json({ success: true, admins });
});


// Gerçek sistem uyarıları (örnek: yedekleme, disk, bağlantı)
router.get('/system-warnings', async (req, res) => {
  const warnings = [];
  // Disk alanı kontrolü
  try {
    const { freemem, totalmem } = require('os');
    const free = freemem() / 1024 / 1024 / 1024;
    if (free < 1) warnings.push({ type: 'warning', message: 'Sunucuda az bellek kaldı.' });
  } catch {}
  // Mongo bağlantı kontrolü
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 1) warnings.push({ type: 'error', message: 'MongoDB bağlantısı yok.' });
  // Yedekleme dosyası kontrolü
  const backupPath = require('path').join(__dirname, '../../backups/last-backup.zip');
  if (!require('fs').existsSync(backupPath)) warnings.push({ type: 'warning', message: 'Yedekleme yapılmadı.' });
  if (!warnings.length) warnings.push({ type: 'info', message: 'Sistem stabil.' });
  res.json({ success: true, warnings });
});

router.get('/logs', (req, res) => {
  const logFile = path.join(__dirname, '../../logs/activity.log');
  fs.readFile(logFile, 'utf8', (err, data) => {
    if (err) return res.json({ success: false, error: 'Log okunamadı' });
    const logs = data.split('\n').filter(Boolean).slice(-20);
    res.json({ success: true, logs });
  });
});

module.exports = router;
