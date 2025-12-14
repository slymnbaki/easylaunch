import React, { useState } from "react";
import { toast } from "react-toastify";

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFeedback("");
        toast.success("Geri bildiriminiz için teşekkürler!");
      } else {
        toast.error(data.error || "Bir hata oluştu");
      }
    } catch {
      toast.error("Sunucuya ulaşılamadı");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{marginTop:24,background:'#f8f8f8',padding:16,borderRadius:8,maxWidth:400,marginLeft:'auto',marginRight:'auto'}}>
      <label style={{fontWeight:'bold',marginBottom:8,display:'block'}}>Geri Bildirim</label>
      <textarea value={feedback} onChange={e=>setFeedback(e.target.value)} required minLength={5} maxLength={500} rows={3} style={{width:'100%',padding:8,marginBottom:8}} placeholder="Görüş, öneri veya hata bildirimi yazın..." />
      <button type="submit" disabled={loading || !feedback.trim()} style={{padding:'8px 24px',borderRadius:6,background:'#1976d2',color:'#fff',border:'none',fontWeight:'bold'}}>
        {loading ? "Gönderiliyor..." : "Gönder"}
      </button>
      {success && <div style={{color:'#1976d2',marginTop:8}}>Geri bildiriminiz alındı.</div>}
    </form>
  );
}
