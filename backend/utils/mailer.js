import React, { useState } from "react";
import axios from "axios";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendTokenEmail = async (to, token) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Yeni Token Oluşturuldu!",
    text: `Ad: ${token.name}\nSembol: ${token.symbol}\nAdres: ${token.address}\nAğ: ${token.network}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("E-posta gönderilemedi:", err.message);
  }
};

function TokenForm() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState("");
  const [canMint, setCanMint] = useState(false);
  const [canPause, setCanPause] = useState(false);
  const [canBurn, setCanBurn] = useState(false);
  const [network, setNetwork] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Token oluşturma isteği gönder
    await axios.post("/api/tokens/create-token", {
      name,
      symbol,
      initialSupply,
      canMint,
      canPause,
      canBurn,
      network,
      email,
    });

    // Formu sıfırla
    setName("");
    setSymbol("");
    setInitialSupply("");
    setCanMint(false);
    setCanPause(false);
    setCanBurn(false);
    setNetwork("");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Token Adı"
        required
      />
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Token Sembolü"
        required
      />
      <input
        type="number"
        value={initialSupply}
        onChange={(e) => setInitialSupply(e.target.value)}
        placeholder="Başlangıç Arzı"
        required
      />
      <label>
        <input
          type="checkbox"
          checked={canMint}
          onChange={(e) => setCanMint(e.target.checked)}
        />
        Mint Edilebilir
      </label>
      <label>
        <input
          type="checkbox"
          checked={canPause}
          onChange={(e) => setCanPause(e.target.checked)}
        />
        Duraklatılabilir
      </label>
      <label>
        <input
          type="checkbox"
          checked={canBurn}
          onChange={(e) => setCanBurn(e.target.checked)}
        />
        Yakılabilir
      </label>
      <input
        type="text"
        value={network}
        onChange={(e) => setNetwork(e.target.value)}
        placeholder="Ağ"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-posta adresiniz"
        required
      />
      <button type="submit">Token Oluştur</button>
    </form>
  );
}

export default TokenForm;