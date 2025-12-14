
import React, { useState, useEffect } from 'react';
import { AIAssistantCard, FeedbackForm } from '../components';


export default function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    // Simülasyon: API fetch veya içerik hazırlığı
    setTimeout(() => {
      // setError('Yetki gerekiyor'); // Yetki hatası simülasyonu için açılabilir
      setContentReady(true); // Dummy data
      setLoading(false);
    }, 1200);
  }, []);

  return (
    <section style={{position:'relative',padding:'2rem 0',textAlign:'center',background:'transparent',minHeight:'60vh',overflow:'hidden'}}>
      {/* ...existing code... */}
      <div className="neon-waves" style={{position:'absolute',left:0,bottom:0,width:'100vw',height:'180px',pointerEvents:'none',zIndex:-1}}>
        <svg width="100%" height="180" viewBox="0 0 1440 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 40 Q 200 120 480 60 T 960 120 T 1440 40" stroke="#38bdf8" stroke-width="8" fill="none" filter="url(#glow1)"/>
          <path d="M0 100 Q 400 20 720 160 T 1440 100" stroke="#a855f7" stroke-width="8" fill="none" filter="url(#glow2)"/>
          <path d="M0 160 Q 300 80 900 40 T 1440 160" stroke="#22d3ee" stroke-width="8" fill="none" filter="url(#glow3)"/>
          <defs>
            <filter id="glow1"><feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#38bdf8" flood-opacity="0.7"/></filter>
            <filter id="glow2"><feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#a855f7" flood-opacity="0.7"/></filter>
            <filter id="glow3"><feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#22d3ee" flood-opacity="0.7"/></filter>
          </defs>
        </svg>
      </div>
      <h1 style={{
        color:'#111',
        fontSize:'2.6rem',
        marginBottom:12,
        fontWeight:'bold',
        textAlign:'center',
        letterSpacing:'.5px',
        maxWidth:'90vw'
      }}>EasyLaunch ile 1 Dakikada Token!</h1>
      {loading && <div style={{color:'#38bdf8',fontSize:20,margin:'2rem'}}>Yükleniyor...</div>}
      {error && <div style={{color:'#fb7185',fontSize:18,margin:'2rem'}}>{error}</div>}
      {!loading && !error && contentReady && (
        <>
          <p style={{color:'#64748b',fontSize:'1.2rem',marginBottom:32}}>Kod yazmadan, multi-chain, güvenli ve audited Web3 token & launchpad platformu.</p>

          <div style={{display:'flex',justifyContent:'center',gap:32,marginBottom:32,flexWrap:'wrap'}}>
            <div className="card" style={{padding:'2rem',minWidth:220,display:'flex',flexDirection:'column',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:28,color:'#38bdf8',fontWeight:'bold'}}>1</span>
                <span style={{color:'#222',fontWeight:'bold',fontSize:18}}>Paket Seç</span>
              </div>
              <div style={{color:'#64748b',fontSize:15,marginTop:8}}>İhtiyacına uygun paketi seç.</div>
            </div>
            <div className="card" style={{padding:'2rem',minWidth:220,display:'flex',flexDirection:'column',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:28,color:'#22d3ee',fontWeight:'bold'}}>2</span>
                <span style={{color:'#222',fontWeight:'bold',fontSize:18}}>Detayları Gir</span>
              </div>
              <div style={{color:'#64748b',fontSize:15,marginTop:8}}>Token bilgilerini ve ağı seç.</div>
            </div>
            <div className="card" style={{padding:'2rem',minWidth:220,display:'flex',flexDirection:'column',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontSize:28,color:'#a855f7',fontWeight:'bold'}}>3</span>
                <span style={{color:'#222',fontWeight:'bold',fontSize:18}}>Deploy & Tamamla</span>
              </div>
              <div style={{color:'#64748b',fontSize:15,marginTop:8}}>Cüzdanından onayla, explorer linkiyle takip et.</div>
            </div>
          </div>



          <div style={{margin:'2rem auto',maxWidth:700,textAlign:'left',background:'#f3f4f6',borderRadius:16,padding:'2rem',boxShadow:'0 0 25px rgba(56,189,248,0.08)'}}>
            <h3 style={{color:'#a855f7',marginBottom:12}}>Neden EasyLaunch?</h3>
            <ul style={{color:'#222',fontSize:17,lineHeight:2}}>
              <li>✅ Kod gerekmez, herkes için kolay</li>
              <li>✅ Multi-chain: Sepolia, BSC, Polygon, Avalanche...</li>
              <li>✅ AI ile isim/supply önerisi</li>
              <li>✅ Şeffaf ve düşük ücret</li>
              <li>✅ Güvenli, audited, OpenZeppelin tabanlı</li>
              <li>✅ Deploy YOUR wallet, contract verified</li>
            </ul>
          </div>

          <div style={{margin:'2rem auto',maxWidth:700,textAlign:'left',background:'#f3f4f6',borderRadius:16,padding:'2rem',boxShadow:'0 0 25px rgba(56,189,248,0.08)'}}>
            <h3 style={{color:'#38bdf8',marginBottom:12}}>EasyLaunch vs Diğer Platformlar</h3>
            <table style={{width:'100%',color:'#222',fontSize:16}}>
              <thead>
                <tr style={{color:'#22d3ee'}}>
                  <th style={{textAlign:'left',padding:'8px'}}>Özellik</th>
                  <th style={{textAlign:'center',padding:'8px'}}>EasyLaunch</th>
                  <th style={{textAlign:'center',padding:'8px'}}>Diğerleri</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Kod gerekmez</td><td style={{textAlign:'center'}}>✔</td><td style={{textAlign:'center'}}>✖</td></tr>
                <tr><td>Multi-chain</td><td style={{textAlign:'center'}}>✔</td><td style={{textAlign:'center'}}>✖</td></tr>
                <tr><td>AI öneri</td><td style={{textAlign:'center'}}>✔</td><td style={{textAlign:'center'}}>✖</td></tr>
                <tr><td>Şeffaf ücret</td><td style={{textAlign:'center'}}>✔</td><td style={{textAlign:'center'}}>✖</td></tr>
                <tr><td>OpenZeppelin tabanlı</td><td style={{textAlign:'center'}}>✔</td><td style={{textAlign:'center'}}>✖</td></tr>
                <tr><td>Deploy YOUR wallet</td><td style={{textAlign:'center'}}>✔</td><td style={{textAlign:'center'}}>✖</td></tr>
                <tr><td>Contract verified</td><td style={{textAlign:'center'}}>✔</td><td style={{textAlign:'center'}}>✖</td></tr>
              </tbody>
            </table>
          </div>
          {/* AI Assistant Card */}
          <div style={{margin:'2rem auto',maxWidth:500}}>
            <AIAssistantCard />
          </div>
          {/* Feedback Form */}
          <div style={{margin:'2rem auto',maxWidth:500}}>
            <FeedbackForm />
          </div>
        </>
      )}
      {!loading && !error && !contentReady && (
        <div style={{color:'var(--warning)',fontSize:18,margin:'2rem'}}>Yakında! Henüz ana sayfa verisi yok.</div>
      )}
    </section>
  );
}
