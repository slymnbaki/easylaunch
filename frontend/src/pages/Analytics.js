import React, { useEffect, useState } from 'react';

export default function AnalyticsPage({ setGlobalLoading, setToast }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setGlobalLoading && setGlobalLoading(true);
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setStats(data.stats);
        } else {
          setToast && setToast({ message: 'Analytics verisi alınamadı!', type: 'error' });
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
  }, [setGlobalLoading, setToast]);

  return (
    <section style={{padding:'2rem 0',textAlign:'center',background:'#f8fafc',minHeight:'60vh'}}>
      <h2 style={{color:'#a855f7',marginBottom:24}}>Analytics</h2>
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
        <h3 style={{color:'#22d3ee',marginTop:32}}>Grafikler</h3>
        <div style={{marginTop:16,display:'flex',justifyContent:'center'}}>
          <img
            src={window.location.origin + '/analytics-demo.png'}
            alt="Analytics Demo"
            onError={e => { e.target.onerror=null; e.target.src='https://placehold.co/500x300?text=Analytics+Demo'; }}
            style={{
              width:'100%',
              maxWidth:520,
              borderRadius:18,
              boxShadow:'0 6px 32px #38bdf855, 0 2px 16px #0002',
              border:'2.5px solid #38bdf8',
              background:'#fff',
              transition:'transform 0.2s, box-shadow 0.2s',
              cursor:'pointer',
            }}
            onMouseOver={e => { e.currentTarget.style.transform='scale(1.03)'; e.currentTarget.style.boxShadow='0 12px 48px #38bdf899, 0 4px 24px #0003'; }}
            onMouseOut={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow='0 6px 32px #38bdf855, 0 2px 16px #0002'; }}
          />
        </div>
      </div>
    </section>
  );
}
