
import React, { useState, useEffect } from 'react';
import TokenWizard from '../components/TokenWizard';

export default function TokenCreate() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wizardReady, setWizardReady] = useState(false);

  useEffect(() => {
    // Simülasyon: API fetch veya wizard hazırlığı
    setTimeout(() => {
      // setError('Yetki gerekiyor'); // Yetki hatası simülasyonu için açılabilir
      setWizardReady(true); // Dummy data
      setLoading(false);
    }, 1200);
  }, []);

  return (
    <section style={{padding:'2rem 0',textAlign:'center',background:'var(--bg-main)',minHeight:'80vh'}}>
      <h2 style={{color:'var(--accent-blue)',marginBottom:24}}>Token Oluşturma Sihirbazı</h2>
      {loading && <div style={{color:'var(--accent-blue)',fontSize:20,margin:'2rem'}}>Yükleniyor...</div>}
      {error && <div style={{color:'var(--danger)',fontSize:18,margin:'2rem'}}>{error}</div>}
      {!loading && !error && wizardReady && <TokenWizard />}
      {!loading && !error && !wizardReady && (
        <div style={{color:'var(--warning)',fontSize:18,margin:'2rem'}}>Yakında! Henüz token oluşturma aktif değil.</div>
      )}
    </section>
  );
}
