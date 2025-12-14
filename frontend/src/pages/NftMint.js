import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function NftMintPage() {
  const [collections, setCollections] = useState([]);
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(true);
  const [minting, setMinting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/nft/collections')
      .then(res => res.json())
      .then(data => {
        setCollections(data.collections || []);
        setLoading(false);
      })
      .catch(() => {
        setCollections([
          { _id: 'demo1', name: 'Demo NFT Koleksiyonu 1' },
          { _id: 'demo2', name: 'Demo NFT Koleksiyonu 2' },
          { _id: 'demo3', name: 'Demo NFT Koleksiyonu 3' }
        ]);
        setError('Gerçek koleksiyonlar yüklenemedi, demo koleksiyonlar gösteriliyor.');
        setLoading(false);
      });
  }, []);

  const handleMint = async () => {
    if (!selected) return toast.error('Koleksiyon seçmelisiniz!');
    setMinting(true);
    try {
      const res = await fetch('/api/nft/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: selected })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Mint işlemi başarılı!');
      } else {
        toast.error('Mint işlemi başarısız!');
      }
    } catch {
      toast.error('Sunucu hatası!');
    }
    setMinting(false);
  };

  return (
    <section style={{padding:'2rem 0',background:'var(--bg-main)',minHeight:'60vh'}}>
      <h2 style={{color:'var(--accent-cyan)',marginBottom:24}}>NFT Mint</h2>
      <div style={{maxWidth:600,margin:'0 auto',background:'#fff',borderRadius:12,padding:32,boxShadow:'0 2px 16px #0001'}}>
        {loading && <div>Yükleniyor...</div>}
        {error && <div style={{color:'red'}}>{error}</div>}
        <p>Koleksiyon NFT'lerini mint et.</p>
        <select value={selected} onChange={e=>setSelected(e.target.value)} style={{width:'100%',marginBottom:12,padding:8,borderRadius:6}}>
          <option value="">Koleksiyon seçiniz</option>
          {collections.map(col => (
            <option key={col._id} value={col._id}>{col.name}</option>
          ))}
        </select>
        <button onClick={handleMint} disabled={minting} style={{marginTop:8,padding:'10px 24px',borderRadius:8,background:'var(--accent-cyan)',color:'#fff',fontWeight:600,border:'none'}}>{minting ? 'Mint ediliyor...' : 'Mint Et'}</button>
      </div>
    </section>
  );
}
