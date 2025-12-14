const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  initialSupply: {
    type: Number,
    required: true,
  },
  canMint: {
    type: Boolean,
    default: false,
  },
  canPause: {
    type: Boolean,
    default: false,
  },
  canBurn: {
    type: Boolean,
    default: false,
  },
  network: {
    type: String,
    required: true,
  },
  contractAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  ownerEmail: {
    type: String,
    required: true,
    lowercase: true,
  },
  packageType: {
    type: String,
    enum: ["free", "basic", "standard", "premium", "enterprise"],
    default: "free",
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    default: null,
  },
  deployerAddress: {
    type: String,
    required: true,
    lowercase: true,
  },
  txHash: {
    type: String,
    required: true,
    lowercase: true,
  },
  status: {
    type: String,
    enum: ["pending", "deployed", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes
TokenSchema.index({ contractAddress: 1 });
TokenSchema.index({ ownerEmail: 1 });
TokenSchema.index({ network: 1 });

module.exports = mongoose.model("Token", TokenSchema);