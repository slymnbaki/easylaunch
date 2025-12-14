import React, { useState, useEffect } from 'react';
export default function FeedbackForm() {
  const [form, setForm] = useState({ email: '', message: '', rating: 5 });
  const [result, setResult] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const handleSubmit = async e => {
    e.preventDefault();
    setResult('');
    await fetch('/api/feedback/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setResult('Teşekkürler!');
    setForm({ email: '', message: '', rating: 5 });
    fetchFeedbacks();
  };
  const fetchFeedbacks = async () => {
    const res = await fetch('/api/feedback/all');
    setFeedbacks(await res.json());
  };
  useEffect(() => { fetchFeedbacks(); }, []);
  return (
    <div className="container" style={{marginTop:32}}>
      <h3>Geri Bildirim</h3>
      <form onSubmit={handleSubmit}>
        <input required placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
        <textarea required placeholder="Yorumunuz" value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} />
        <input type="number" min={1} max={5} value={form.rating} onChange={e=>setForm(f=>({...f,rating:e.target.value}))} />
        <button type="submit">Gönder</button>
      </form>
      {result && <div style={{marginTop:12}}>{result}</div>}
      <div style={{marginTop:24}}>
        <b>Son Yorumlar:</b>
        <ul>{feedbacks.map(f=>(<li key={f._id}>{f.email}: {f.message} ({f.rating}/5)</li>))}</ul>
      </div>
    </div>
  );
}
