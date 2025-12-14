const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Feedback = mongoose.model('Feedback', new mongoose.Schema({
  email: String,
  message: String,
  rating: Number,
  createdAt: { type: Date, default: Date.now }
}));

router.post('/submit', async (req, res) => {
  const { email, message, rating } = req.body;
  await Feedback.create({ email, message, rating });
  res.json({ success: true });
});

router.get('/all', async (req, res) => {
  const feedbacks = await Feedback.find().sort({ createdAt: -1 });
  res.json(feedbacks);
});

module.exports = router;
