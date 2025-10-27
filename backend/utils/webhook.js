const axios = require("axios");

exports.sendTokenWebhook = async (token) => {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL; // .env dosyanda tanımlı olmalı
  if (!webhookUrl) return;

  const message = {
    content: `Yeni Token Oluşturuldu!\nAd: ${token.name}\nSembol: ${token.symbol}\nAdres: ${token.address}\nAğ: ${token.network}`
  };

  try {
    await axios.post(webhookUrl, message);
  } catch (err) {
    console.error("Webhook gönderilemedi:", err.message);
  }
};