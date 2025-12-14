const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  txHash: { type: String, required: true, unique: true },
  paymentMethod: { type: String, enum: ["normal", "elt"], required: true },
  paymentNetwork: { type: String, required: true },
  userEmail: { type: String, required: true },
  amount: { type: String, required: true },
  packageType: { type: String, enum: ["free", "basic", "pro"], default: "free" },
  status: { type: String, enum: ["pending", "confirmed", "failed"], default: "pending" },
  used: { type: Boolean, default: false },
  tokenAddress: { type: String },
  confirmedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payment", PaymentSchema);