import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({ email: '', message: '', rating: 5 });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchFeedbacks = async () => {
    setFetching(true);
    try {
      const res = await fetch('/api/feedback/all');
      const data = await res.json();
      setFeedbacks(data);
    } catch {
      setFeedbacks([]);
    }
    setFetching(false);
  };

  useEffect(() => { fetchFeedbacks(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Teşekkürler! Yorumunuz alındı.');
        setForm({ email: '', message: '', rating: 5 });
        fetchFeedbacks();
      } else {
        toast.error('Yorum gönderilemedi!');
      }
    } catch {
      toast.error('Sunucu hatası!');
    }
    setLoading(false);
  };

  return (
    <section style={{padding:'2rem 0',textAlign:'center',background:'#f8fafc',minHeight:'60vh'}}>
      <h2 style={{color:'#4ade80',marginBottom:24}}>Geri Bildirimler</h2>
      <div style={{maxWidth:600,margin:'0 auto',background:'#fff',borderRadius:12,padding:32,boxShadow:'0 2px 16px #0001',textAlign:'left'}}>
        <h3 style={{color:'#38bdf8'}}>Son Yorumlar</h3>
        {fetching ? <div style={{color:'#38bdf8',margin:'1rem'}}>Yükleniyor...</div> : (
          <ul style={{fontSize:17,lineHeight:2}}>
            {feedbacks.length === 0 && <li>Henüz yorum yok.</li>}
            {feedbacks.map((f,i)=>(
              <li key={i}><b>{f.email}:</b> {f.message} <span style={{color:'#4ade80'}}>({f.rating}/5)</span></li>
            ))}
          </ul>
        )}
        <h3 style={{color:'#a855f7',marginTop:32}}>Yorumunu Gönder</h3>
        <form style={{marginTop:12}} onSubmit={handleSubmit}>
          <input required placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} style={{width:'100%',marginBottom:8,padding:8,borderRadius:6}} />
          <textarea required placeholder="Yorumunuz" value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} style={{width:'100%',marginBottom:8,padding:8,borderRadius:6}} />
          <input type="number" min={1} max={5} value={form.rating} onChange={e=>setForm(f=>({...f,rating:e.target.value}))} style={{width:'100px',marginBottom:8,padding:8,borderRadius:6}} />
          <button type="submit" disabled={loading} style={{padding:'10px 24px',borderRadius:8,background:'#4ade80',color:'#fff',fontWeight:600,border:'none'}}>{loading ? 'Gönderiliyor...' : 'Gönder'}</button>
        </form>
      </div>
    </section>
  );
}
