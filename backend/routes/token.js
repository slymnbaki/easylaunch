const express = require('express');
const router = express.Router();

// Basit token listeleme endpointi (örnek)
const Token = require('../models/Token');
router.get('/', async (req, res) => {
  try {
    const tokens = await Token.find({});
    res.json({ tokens });
  } catch (err) {
    res.status(500).json({ error: 'Veri alınamadı', details: err.message });
  }
});

// Basit token oluşturma endpointi (örnek)
const tokenController = require('../controllers/tokenController');

// Gerçek token üretimi
router.post('/create', tokenController.deployToken);

module.exports = router;
