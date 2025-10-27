const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
  launchpadId: String,
  buyer: String,
  amount: Number,
  txHash: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Purchase", PurchaseSchema);