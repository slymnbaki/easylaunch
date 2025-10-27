import React, { useState } from "react";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("https://localhost:3001/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Şifre Sıfırlama</h2>
      <div>
        <label>
          E-posta ile aldığınız sıfırlama token'ı:
          <input
            type="text"
            value={token}
            onChange={e => setToken(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Yeni Şifre:
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit">Şifreyi Sıfırla</button>
      {result && <div style={{ color: result.success ? "green" : "red" }}>{result.message}</div>}
    </form>
  );
}