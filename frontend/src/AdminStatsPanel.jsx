import React, { useEffect, useState } from "react";
import axios from "axios";

function AdminStatsPanel() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("/api/admin/stats")
      .then(res => setStats(res.data))
      .catch(() => setStats(null));
  }, []);

  if (!stats) return <p>Yükleniyor...</p>;

  return (
    <div>
      <h3>Admin İstatistikleri</h3>
      <ul>
        <li>Toplam Token: {stats.tokenCount}</li>
        <li>Toplam Kullanıcı: {stats.userCount}</li>
        <li>Toplam Launchpad: {stats.launchpadCount}</li>
        <li>Bekleyen KYC: {stats.kycPending}</li>
        <li>Onaylı KYC: {stats.kycApproved}</li>
      </ul>
    </div>
  );
}

export default AdminStatsPanel;