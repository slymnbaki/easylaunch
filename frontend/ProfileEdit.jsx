import React, { useState } from "react";
export default function ProfileEdit({ user }) {
  const [email, setEmail] = useState(user.email || "");
  const [username, setUsername] = useState(user.username || "");
  const [password, setPassword] = useState("");

  const handleSave = async () => {
    // API ile güncelleme işlemi
  };

  return (
    <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-posta" />
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Kullanıcı adı" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Yeni şifre" />
      <button type="submit">Kaydet</button>
      <button aria-label="Çıkış Yap" tabIndex={0}>Çıkış Yap</button>
    </form>
  );
}