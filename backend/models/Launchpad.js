const mongoose = require("mongoose");

const LaunchpadSchema = new mongoose.Schema({
  tokenAddress: String,
  owner: String,
  saleStart: Date,
  saleEnd: Date,
  price: Number,
  hardCap: Number,
  softCap: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Launchpad", LaunchpadSchema);