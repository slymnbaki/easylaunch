const express = require("express");
const router = express.Router();

const tokens = [];

router.post("/create-token", (req, res) => {
  const { name, symbol, desc, userAddress, paymentMethod } = req.body || {};
  if (!name || !symbol) return res.status(400).json({ success: false });
  const t = { id: tokens.length + 1, name, symbol, desc, owner: userAddress, paymentMethod };
  tokens.push(t);
  return res.json({ success: true, token: t });
});

router.get("/", (req, res) => {
  return res.json({ tokens });
});

module.exports = router;