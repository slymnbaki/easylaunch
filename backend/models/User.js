const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  kycStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  // Diğer kullanıcı alanları eklenebilir
});

module.exports = mongoose.model("User", UserSchema);