const mongoose = require('mongoose');

const SwapSchema = new mongoose.Schema({
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromToken: { type: String, required: true }, // Token address or 'native'
  toToken: { type: String, required: true },   // Token address or 'native'
  fromAmount: { type: Number, required: true },
  toAmount: { type: Number, required: true },
  network: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  txHash: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Swap', SwapSchema);
