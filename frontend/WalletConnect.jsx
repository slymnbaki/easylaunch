import React, { useState } from "react";

export default function AuthForm({ onAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [result, setResult] = useState(null);
  const [checked, setChecked] = useState(false);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checked) {
      setResult({ message: "Lütfen kullanım şartlarını ve gizlilik politikasını onaylayın." });
      return;
    }
    const url = mode === "login" ? "/api/login" : "/api/register";
    const response = await fetch(`http://localhost:3001${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    setResult(data);
    if (data.success && data.token) {
      localStorage.setItem("token", data.token);
      if (onAuth) onAuth(data.token);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAddress(accounts[0]);
        setError("");
        if (onAddress) onAddress(accounts[0]);
      } catch (err) {
        setError("Cüzdan bağlantısı reddedildi.");
      }
    } else {
      setError("MetaMask yüklü değil! Lütfen MetaMask kurun.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Kullanıcı Adı:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Şifre:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            Kullanım şartlarını ve gizlilik politikasını okudum ve kabul ediyorum.
          </label>
        </div>
        <button type="submit">{mode === "login" ? "Giriş Yap" : "Kaydol"}</button>
        {result && <div style={{ color: result.success ? "green" : "red" }}>{result.message}</div>}
      </form>
      <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Hesabın yok mu? Kaydol" : "Zaten bir hesabın var mı? Giriş Yap"}
      </button>
      <div style={{ marginBottom: 16 }}>
        <button type="button" onClick={connectWallet}>
          {address ? `Bağlı: ${address}` : "Cüzdanı Bağla"}
        </button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      </div>
    </div>
  );
}