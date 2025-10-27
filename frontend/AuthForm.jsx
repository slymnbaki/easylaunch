import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function AuthForm({ onAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login");
  const [result, setResult] = useState(null);
  const [checked, setChecked] = useState(false);
  const [captcha, setCaptcha] = useState(null);
  const [email, setEmail] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetResult, setResetResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checked) {
      setResult({ message: "Lütfen kullanım şartlarını ve gizlilik politikasını onaylayın." });
      return;
    }
    if (!captcha) {
      setResult({ message: "Lütfen robot olmadığınızı doğrulayın." });
      return;
    }
    const url = mode === "login" ? "/api/login" : "/api/register";
    const response = await fetch(`http://localhost:3001${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, ...(mode === "register" && { email }) }),
    });
    const data = await response.json();
    setResult(data);
    if (data.success && data.token) {
      localStorage.setItem("token", data.token);
      if (onAuth) onAuth(username);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:3001/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail }),
    });
    const data = await response.json();
    setResetResult(data);
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
        {mode === "register" && (
          <div>
            <label>
              E-posta:
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </label>
          </div>
        )}
        <div>
          <label>
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              required
            />
            <a href="/terms" target="_blank" rel="noopener noreferrer">Kullanım Şartları</a> ve
            <a href="/privacy" target="_blank" rel="noopener noreferrer">Gizlilik Politikası</a>’nı okudum ve kabul ediyorum.
          </label>
        </div>
        <ReCAPTCHA
          sitekey="SENIN_SITE_KEYIN"
          onChange={value => setCaptcha(value)}
        />
        <button type="submit">{mode === "login" ? "Giriş Yap" : "Kaydol"}</button>
        {result && <div style={{ color: result.success ? "green" : "red" }}>{result.message}</div>}
      </form>
      <button onClick={() => setMode(mode === "login" ? "register" : "login")}>
        {mode === "login" ? "Hesabın yok mu? Kaydol" : "Zaten bir hesabın var mı? Giriş Yap"}
      </button>
      <button style={{ marginTop: 8 }} onClick={() => setShowReset(true)}>
        Şifremi Unuttum
      </button>
      {showReset && (
        <div style={{ marginTop: 16, background: "#f8f8f8", padding: 16, borderRadius: 8 }}>
          <form onSubmit={handleReset}>
            <label>
              E-posta ile şifre sıfırlama:
              <input
                type="email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                required
              />
            </label>
            <button type="submit">Sıfırlama Linki Gönder</button>
          </form>
          {resetResult && (
            <div style={{ color: resetResult.success ? "green" : "red" }}>
              {resetResult.message}
            </div>
          )}
          <button onClick={() => setShowReset(false)}>Kapat</button>
        </div>
      )}
    </div>
  );
}