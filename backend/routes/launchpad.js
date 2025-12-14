const express = require('express');
const router = express.Router();
const Launchpad = require('../models/Launchpad');


// Launchpad ana endpoint: tüm launchpadleri döndür
router.get('/', async (req, res) => {
  try {
    const launchpads = await Launchpad.find({});
    res.json({ success: true, launchpads });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Veri alınamadı', message: err.message });
  }
});

// Launchpad list endpoint
router.get('/list', async (req, res) => {
  try {
    const launchpads = await Launchpad.find({});
    res.json({ success: true, launchpads });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Veri alınamadı', message: err.message });
  }
});

module.exports = router;
