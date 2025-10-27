import React, { useState } from "react";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";

export default function TokenForm() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState(1000);
  const [canMint, setCanMint] = useState(false);
  const [canPause, setCanPause] = useState(false);
  const [canBurn, setCanBurn] = useState(false);
  const [network, setNetwork] = useState("sepolia");
  const [email, setEmail] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API = process.env.REACT_APP_API_URL || "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captcha) {
      setError("Lütfen captcha'yı tamamlayın.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await axios.post(`${API}/api/tokens/create-token`, {
        name,
        symbol,
        initialSupply: Number(initialSupply),
        canMint,
        canPause,
        canBurn,
        network,
        email,
        captcha,
      });
      // reset
      setName("");
      setSymbol("");
      setInitialSupply(1000);
      setCanMint(false);
      setCanPause(false);
      setCanBurn(false);
      setNetwork("sepolia");
      setEmail("");
      setCaptcha("");
    } catch (err) {
      console.error(err);
      setError("Token oluşturulurken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Yeni Token Oluştur</h2>
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
          onChange={(e) => setInitialSupply(Number(e.target.value))}
          placeholder="Başlangıç Arzı"
          required
        />
        <label>
          <input
            type="checkbox"
            checked={canMint}
            onChange={(e) => setCanMint(e.target.checked)}
          />{" "}
          Mint Edilebilir
        </label>
        <label>
          <input
            type="checkbox"
            checked={canPause}
            onChange={(e) => setCanPause(e.target.checked)}
          />{" "}
          Duraklatılabilir
        </label>
        <label>
          <input
            type="checkbox"
            checked={canBurn}
            onChange={(e) => setCanBurn(e.target.checked)}
          />{" "}
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
        <ReCAPTCHA
          sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY || "REPLACE_WITH_KEY"}
          onChange={(token) => setCaptcha(token)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Oluşturuluyor..." : "Token Oluştur"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}