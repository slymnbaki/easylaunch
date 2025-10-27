const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  name: String,
  symbol: String,
  initialSupply: Number,
  canMint: Boolean,
  canPause: Boolean,
  canBurn: Boolean,
  network: String,
  address: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Token", TokenSchema);