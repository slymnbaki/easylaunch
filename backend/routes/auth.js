const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");

// Şifre sıfırlama isteği
router.post("/reset-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false, message: "E-posta bulunamadı." });

  const token = crypto.randomBytes(32).toString("hex");
  user.resetToken = token;
  user.resetTokenExpires = Date.now() + 3600 * 1000; // 1 saat
  await user.save();

  // E-posta gönderimi
  const transporter = nodemailer.createTransport({
    host: "smtp.yourprovider.com",
    port: 587,
    secure: false,
    auth: {
      user: "your@email.com",
      pass: "yourpassword"
    }
  });
  await transporter.sendMail({
    to: email,
    subject: "Şifre Sıfırlama",
    html: `<a href="https://easylaunch.com/reset?token=${token}">Şifrenizi sıfırlamak için tıklayın</a>`
  });

  res.json({ success: true, message: "Sıfırlama linki e-posta adresinize gönderildi." });
});

// Kayıt ve e-posta aktivasyonu
router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  // Kullanıcı oluşturma kodu (örnek)
  let user = new User({ username, password, email });
  const verifyToken = crypto.randomBytes(32).toString("hex");
  user.verifyToken = verifyToken;
  user.isVerified = false;
  await user.save();

  const transporter = nodemailer.createTransport({
    host: "smtp.yourprovider.com",
    port: 587,
    secure: false,
    auth: {
      user: "your@email.com",
      pass: "yourpassword"
    }
  });
  await transporter.sendMail({
    to: email,
    subject: "Hesap Aktivasyonu",
    html: `<a href="https://easylaunch.com/verify?token=${verifyToken}">Hesabınızı aktifleştirmek için tıklayın</a>`
  });

  res.json({ success: true, message: "Kayıt başarılı! Aktivasyon linki e-posta adresinize gönderildi." });
});

// E-posta aktivasyon doğrulama
router.get("/verify", async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({ verifyToken: token });
  if (!user) return res.json({ success: false, message: "Geçersiz veya süresi dolmuş token." });
  user.isVerified = true;
  user.verifyToken = undefined;
  await user.save();
  res.json({ success: true, message: "Hesabınız aktifleştirildi!" });
});

// Şifre sıfırlama onayı
router.post("/reset-password/confirm", async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await User.findOne({
    resetToken: token,
    resetTokenExpires: { $gt: Date.now() }
  });
  if (!user) return res.json({ success: false, message: "Geçersiz veya süresi dolmuş token." });

  // Şifreyi hashle
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  await ActivityLog.create({
    user: user._id,
    action: "reset_password",
    details: { ip: req.ip }
  });

  res.json({ success: true, message: "Şifreniz başarıyla güncellendi." });
});

// Sadece admin erişimi için middleware
function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Yetkisiz erişim" });
}

router.get("/admin/some-action", isAdmin, (req, res) => {
  // admin işlemi
});

module.exports = router;

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  role: { type: String, default: "user" } // "admin" veya "user"
});