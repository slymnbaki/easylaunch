import React, { useEffect, useState } from "react";

export default function AdminPanel() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("https://localhost:3001/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  if (!stats) return <div>Yükleniyor...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 24 }}>
      <h2>Admin Paneli</h2>
      <div>Kullanıcı Sayısı: {stats.userCount}</div>
      <div>Token Sayısı: {stats.tokenCount}</div>
      {/* Daha fazla istatistik ve yönetim aracı ekleyebilirsiniz */}
    </div>
  );
}