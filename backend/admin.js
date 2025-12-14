// Basit admin endpointleri
const express = require('express');
const router = express.Router();
const User = require('./models/User');
const Token = require('./models/Token');
const Payment = require('./models/Payment');

// Tüm kullanıcıları getir
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});
const cache = require('./middleware/cache');
// Tüm tokenları getir (cache'li)
router.get('/tokens', cache(30), async (req, res) => {
  const tokens = await Token.find();
  res.json(tokens);
});
// Tüm ödemeleri getir
router.get('/payments', async (req, res) => {
  const payments = await Payment.find();
  res.json(payments);
});

module.exports = router;
