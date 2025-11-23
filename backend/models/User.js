const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: String,
  kycStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  username: String,
  verifyToken: String,
  isVerified: { type: Boolean, default: false },
  resetToken: String,
  resetTokenExpires: Date,
  role: { type: String, default: "user" }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
