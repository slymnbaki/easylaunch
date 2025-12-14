const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const NftSchema = new mongoose.Schema({
  name: String,
  image: String,
  owner: String,
  minted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const Nft = mongoose.model('Nft', NftSchema);

// Koleksiyonları listele
router.get('/collections', async (req, res) => {
  try {
    const collections = await Nft.find({});
    res.json({ collections });
  } catch (err) {
    res.status(500).json({ error: 'Veri alınamadı', details: err.message });
  }
});

// Mint işlemi
router.post('/mint', async (req, res) => {
  const { collection } = req.body;
  try {
    const nft = await Nft.findById(collection);
    if (!nft) return res.status(404).json({ success: false, error: 'Koleksiyon bulunamadı' });
    nft.minted = true;
    await nft.save();
    res.json({ success: true, nft });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Mint işlemi başarısız', details: err.message });
  }
});

module.exports = router;
