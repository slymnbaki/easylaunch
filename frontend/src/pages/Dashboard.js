

import React, { useEffect, useState } from 'react';

export default function Dashboard({ setGlobalLoading, setToast }) {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    setGlobalLoading && setGlobalLoading(true);
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setStats(data.stats);
        } else {
          setToast && setToast({ message: 'Dashboard verisi alınamadı!', type: 'error' });
        }
        setGlobalLoading && setGlobalLoading(false);
      })
      .catch(err => {
        setStats({
          tokenCount: 123,
          userCount: 456,
          launchpadCount: 7,
          kycPending: 2
        });
        setToast && setToast({ message: 'Demo verisi gösteriliyor.', type: 'info' });
        setGlobalLoading && setGlobalLoading(false);
      });
    fetch('/api/tokens?limit=3')
      .then(res => res.json())
      .then(data => {
        if (data.tokens) setRecent(data.tokens);
      })
      .catch(() => {
        setRecent([
          { name: 'DemoToken', symbol: 'DMT', address: '0x123...', totalSupply: 1000000 },
          { name: 'TestCoin', symbol: 'TST', address: '0x456...', totalSupply: 500000 },
          { name: 'SampleToken', symbol: 'SMP', address: '0x789...', totalSupply: 250000 }
        ]);
      });
  }, [setGlobalLoading, setToast]);

  return (
    <section style={{padding:'2rem 0',textAlign:'center',background:'#f8fafc',minHeight:'60vh'}}>
      <h2 style={{color:'#a855f7',marginBottom:24}}>Dashboard</h2>
      <div style={{maxWidth:700,margin:'0 auto',background:'#fff',borderRadius:12,padding:32,boxShadow:'0 2px 16px #0001',textAlign:'left'}}>
        <h3 style={{color:'#38bdf8'}}>Özet</h3>
        {!stats && <div style={{color:'#38bdf8',fontSize:20,margin:'2rem'}}>Yükleniyor...</div>}
        {stats && (
          <ul style={{fontSize:17,lineHeight:2}}>
            <li><b>Toplam Token:</b> {stats.tokenCount}</li>
            <li><b>Toplam Kullanıcı:</b> {stats.userCount}</li>
            <li><b>Aktif Launchpad:</b> {stats.launchpadCount}</li>
            <li><b>KYC Bekleyen:</b> {stats.kycPending}</li>
          </ul>
        )}
        <h3 style={{color:'#22d3ee',marginTop:32}}>Son İşlemler</h3>
        <ul style={{fontSize:16,lineHeight:2}}>
          {recent.length === 0 && <li>Henüz işlem yok.</li>}
          {recent.map((token, i) => (
            <li key={token._id || i}>Token oluşturuldu: {token.name} ({token.symbol}) [{token.network}]</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
