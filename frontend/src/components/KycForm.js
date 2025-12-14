import React, { useState } from 'react';
export default function KycForm() {
  const [form, setForm] = useState({ email: '', name: '', idNumber: '' });
  const [result, setResult] = useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    setResult('');
    const res = await fetch('/api/kyc/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setResult(data.success ? 'Başvuru alındı!' : data.error);
  };
  return (
    <form onSubmit={handleSubmit} style={{maxWidth:320,margin:'2rem auto',padding:24,background:'#fff',borderRadius:8}}>
      <h3>KYC Başvuru</h3>
      <input required placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} style={{width:'100%',marginBottom:8}} />
      <input required placeholder="Ad Soyad" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={{width:'100%',marginBottom:8}} />
      <input required placeholder="Kimlik No" value={form.idNumber} onChange={e=>setForm(f=>({...f,idNumber:e.target.value}))} style={{width:'100%',marginBottom:8}} />
      <button type="submit">Gönder</button>
      {result && <div style={{marginTop:12}}>{result}</div>}
    </form>
  );
}
