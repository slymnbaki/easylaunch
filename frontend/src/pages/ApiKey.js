
import React, { useState } from 'react';

export default function ApiKeyPage({ setGlobalLoading, setToast }) {
  const [apiKey, setApiKey] = useState('');
  const [email, setEmail] = useState('');

  const handleGenerate = async () => {
    if (!email) {
      setToast && setToast({ message: 'Email gerekli!', type: 'error' });
      return;
    }
    setGlobalLoading && setGlobalLoading(true);
    try {
      const res = await fetch('/api/apikey/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.apiKey) {
        setApiKey(data.apiKey);
        setToast && setToast({ message: 'API Key oluşturuldu!', type: 'success' });
      } else {
        setToast && setToast({ message: 'API Key oluşturulamadı!', type: 'error' });
      }
    } catch {
      setToast && setToast({ message: 'Sunucu hatası!', type: 'error' });
    }
    setGlobalLoading && setGlobalLoading(false);
  };

  return (
    <section style={{padding:'2rem 0',textAlign:'center',background:'#f8fafc',minHeight:'60vh'}}>
      <h2 style={{color:'#22d3ee',marginBottom:24}}>API Key Yönetimi</h2>
      <div style={{maxWidth:500,margin:'0 auto',background:'#fff',borderRadius:12,padding:32,boxShadow:'0 2px 16px #0001',textAlign:'left'}}>
        <p>API anahtarlarını oluştur, yönet ve güvenliğini sağla.</p>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={{width:'100%',marginBottom:12,padding:8,borderRadius:6}} />
        <button onClick={handleGenerate} style={{marginTop:8,padding:'10px 24px',borderRadius:8,background:'#22d3ee',color:'#fff',fontWeight:600,border:'none'}}>Yeni API Key Oluştur</button>
        {apiKey && (
          <div style={{marginTop:18,fontSize:17}}>
            <b>API Key:</b> <span style={{background:'#e0f7fa',padding:'6px 12px',borderRadius:8}}>{apiKey.slice(0,8)}****{apiKey.slice(-4)}</span>
          </div>
        )}
      </div>
    </section>
  );
}
