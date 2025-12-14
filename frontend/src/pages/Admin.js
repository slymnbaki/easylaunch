

import React, { useState, useEffect } from 'react';


function AdminCard({ title, value, color }) {
  return (
    <div style={{
      background: '#fff',
      color: '#222',
      borderRadius: 14,
      minWidth: 180,
      padding: '1.5rem 2rem',
      boxShadow: `0 0 0 2px ${color}55, 0 2px 16px #0002`,
      border: `1.5px solid ${color}`,
      textAlign: 'center',
      margin: '0 12px',
    }}>
      <div style={{ fontSize: 32, fontWeight: 'bold', color, marginBottom: 8 }}>{value}</div>
      <div style={{ fontSize: 16, letterSpacing: 1 }}>{title}</div>
    </div>
  );
}

export default function Admin() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/admin').then(r=>r.json()),
      fetch('/api/admin/admins').then(r=>r.json()),
      fetch('/api/admin/users').then(r=>r.json()),
      fetch('/api/admin/system-warnings').then(r=>r.json()),
      fetch('/api/admin/logs').then(r=>r.json())
    ]).then(([statsRes, adminsRes, usersRes, warningsRes, logsRes]) => {
      if (!statsRes.success) throw new Error('İstatistik alınamadı');
      setStats(statsRes.stats);
      setAdmins(adminsRes.admins || []);
      setUsers(usersRes.users || []);
      setWarnings(warningsRes.warnings || []);
      setLogs(logsRes.logs || []);
      setLoading(false);
    }).catch(e => {
      setError(e.message);
      setLoading(false);
    });
  }, []);

  return (
    <section style={{padding:'2rem 0',textAlign:'center',background:'var(--bg-main)',minHeight:'60vh'}}>
      <h2 style={{color:'var(--accent-purple)',fontSize:'2.2rem',marginBottom:12}}>Admin Paneli</h2>
      {loading && <div style={{color:'var(--accent-blue)',fontSize:20,margin:'2rem'}}>Yükleniyor...</div>}
      {error && <div style={{color:'var(--danger)',fontSize:18,margin:'2rem'}}>{error}</div>}
      {!loading && !error && stats && (
        <>
          <div style={{display:'flex',gap:24,justifyContent:'center',flexWrap:'wrap',margin:'2rem 0'}}>
            <AdminCard title="Toplam Token" value={stats.tokenCount} color="#38bdf8" />
            <AdminCard title="Toplam Kullanıcı" value={stats.userCount} color="#4ade80" />
            <AdminCard title="KYC Bekleyen" value={stats.kycPending} color="#facc15" />
            <AdminCard title="Aktif Launchpad" value={stats.launchpadCount} color="#22d3ee" />
            <AdminCard title="Son 24h Token" value={stats.recentTokens} color="#a855f7" />
          </div>
          <h3 style={{color:'#38bdf8',marginTop:32}}>Adminler</h3>
          <ul style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap',listStyle:'none',padding:0}}>
            {admins.map(a=>(<li key={a._id} style={{background:'#e0e7ff',padding:'8px 18px',borderRadius:8}}>{a.email}</li>))}
          </ul>
          <h3 style={{color:'#22d3ee',marginTop:32}}>Kullanıcılar</h3>
          <ul style={{maxHeight:180,overflowY:'auto',margin:'0 auto',maxWidth:400}}>
            {users.map(u=>(<li key={u._id}>{u.email} ({u.kycStatus})</li>))}
          </ul>
          <h3 style={{color:'#facc15',marginTop:32}}>Sistem Uyarıları</h3>
          <ul>
            {warnings.map((w,i)=>(<li key={i} style={{color:w.type==='error'?'#fb7185':w.type==='warning'?'#facc15':'#4ade80'}}>{w.message}</li>))}
          </ul>
          <h3 style={{color:'#a855f7',marginTop:32}}>Son Loglar</h3>
          <ul style={{maxHeight:180,overflowY:'auto',margin:'0 auto',maxWidth:600}}>
            {logs.map((l,i)=>(<li key={i} style={{fontSize:13,color:'#9ca3af'}}>{l}</li>))}
          </ul>
        </>
      )}
      {!loading && !error && !stats && (
        <div style={{color:'#facc15',fontSize:18,margin:'2rem'}}>Yakında! Henüz admin verisi yok.</div>
      )}
    </section>
  );
}
