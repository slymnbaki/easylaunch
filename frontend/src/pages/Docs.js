import React, { useEffect, useState } from 'react';

export default function DocsPage() {
  const [docs, setDocs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/docs/openapi')
      .then(res => res.json())
      .then(data => {
        setDocs(data);
        setLoading(false);
      })
      .catch(() => {
        setDocs({
          info: { description: 'Örnek API dokümantasyonu. Gerçek endpointler için backend aktif olmalı.' },
          paths: {
            '/api/tokens': {
              get: { summary: 'Tüm tokenları listeler.' }
            },
            '/api/feedback/all': {
              get: { summary: 'Tüm kullanıcı geri bildirimlerini getirir.' }
            },
            '/api/admin/stats': {
              get: { summary: 'Genel istatistikleri döner.' }
            }
          }
        });
        setError('');
        setLoading(false);
      });
  }, []);

  return (
    <section style={{padding:'2rem 0',background:'#f8fafc',minHeight:'60vh'}}>
      <h2 style={{color:'#22d3ee',marginBottom:24}}>API Dokümantasyonu</h2>
      <div style={{maxWidth:700,margin:'0 auto',background:'#fff',borderRadius:12,padding:32,boxShadow:'0 2px 16px #0001'}}>
        {loading && <div>Yükleniyor...</div>}
        {error && <div style={{color:'red'}}>{error}</div>}
        {docs && (
          <div>
            <p>{docs.info?.description || 'API endpointlerini ve kullanım örneklerini inceleyin.'}</p>
            <ul style={{fontSize:17,lineHeight:2}}>
              {Object.entries(docs.paths || {}).map(([path, methods]) => (
                Object.entries(methods).map(([method, details]) => (
                  <li key={path+method}>
                    <b>{method.toUpperCase()} {path}</b> - {details.summary || details.description || 'Açıklama yok.'}
                  </li>
                ))
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
import React from 'react';

export default function DocsPage() {
  return (
    <section style={{padding:'2rem 0',textAlign:'center',background:'#f8fafc',minHeight:'60vh'}}>
      <h2 style={{color:'#38bdf8',marginBottom:24}}>Dokümantasyon</h2>
      <div style={{maxWidth:700,margin:'0 auto',background:'#fff',borderRadius:12,padding:32,boxShadow:'0 2px 16px #0001',textAlign:'left'}}>
        <h3 style={{color:'#a855f7'}}>API Kullanımı</h3>
        <ul style={{fontSize:17,lineHeight:2}}>
          <li><b>Token Oluşturma:</b> <code>POST /api/tokens/create</code></li>
          <li><b>KYC Başvuru:</b> <code>POST /api/kyc/submit</code></li>
          <li><b>Feedback Gönder:</b> <code>POST /api/feedback/submit</code></li>
          <li><b>Launchpad Listesi:</b> <code>GET /api/launchpad/list</code></li>
          <li><b>Analytics:</b> <code>GET /api/analytics/summary</code></li>
        </ul>
        <h3 style={{color:'#22d3ee',marginTop:32}}>Swagger & OpenAPI</h3>
        <p>Detaylı endpoint ve parametreler için <a href="/api/docs" style={{color:'#38bdf8'}}>Swagger arayüzünü</a> kullanabilirsiniz.</p>
        <h3 style={{color:'#4ade80',marginTop:32}}>Kullanıcı Kılavuzu</h3>
        <ul style={{fontSize:17,lineHeight:2}}>
          <li>Platforma kayıt ol, KYC başvurunu tamamla.</li>
          <li>Token veya NFT oluştur, launchpad’e ekle.</li>
          <li>Analytics ve dashboard ile projeni takip et.</li>
          <li>Feedback ve destek için iletişime geç.</li>
        </ul>
      </div>
    </section>
  );
}
