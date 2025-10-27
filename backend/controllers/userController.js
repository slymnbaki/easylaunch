const User = require("../models/User");

// Kullanıcı KYC başvurusu (örnek: dosya upload veya form)
exports.kycRequest = async (req, res) => {
  const userId = req.body.userId; // Gerçek projede JWT ile alınmalı
  if (!userId) return res.status(400).json({ error: "Kullanıcı kimliği eksik" });
  await User.findByIdAndUpdate(userId, { kycStatus: "pending" });
  res.json({ message: "KYC başvurunuz alındı." });
};

// Admin KYC onay/reddetme
exports.kycApprove = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { kycStatus: "approved" });
  res.json({ message: "KYC onaylandı." });
};
exports.kycReject = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { kycStatus: "rejected" });
  res.json({ message: "KYC reddedildi." });
};

exports.listKYC = async (req, res) => {
  try {
    const users = await User.find({}, "email kycStatus");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.kycStatus = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId);
  res.json({ status: user.kycStatus });
};