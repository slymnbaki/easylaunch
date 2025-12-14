import React, { useState } from "react";

const UserSettings = ({ user, onSave }) => {
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [lang, setLang] = useState(user?.lang || "tr");
  const [theme, setTheme] = useState(user?.theme || "light");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ username, email, lang, theme });
  };

  return (
    <div className="container">
      <h2>Kullanıcı Ayarları</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Kullanıcı Adı:</label>
          <input value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Email:</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Dil:</label>
          <select value={lang} onChange={e => setLang(e.target.value)}>
            <option value="tr">Türkçe</option>
            <option value="en">English</option>
          </select>
        </div>
        <div>
          <label>Tema:</label>
          <select value={theme} onChange={e => setTheme(e.target.value)}>
            <option value="light">Aydınlık</option>
            <option value="dark">Karanlık</option>
          </select>
        </div>
        <button type="submit">Kaydet</button>
      </form>
    </div>
  );
};

export default UserSettings;
