import React, { useState } from 'react';
import theme from '../theme';
import { useTranslation } from 'react-i18next';

export default function AIAssistantCard() {
  const { t } = useTranslation();
  const [category, setCategory] = useState('');
  const [purpose, setPurpose] = useState('');
  const [audience, setAudience] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuggestion('');
    try {
      const res = await fetch('/api/ai/suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, purpose, audience, budget })
      });
      const data = await res.json();
      if (data.success) setSuggestion(data.suggestion);
      else setError(data.error || data.message || 'Bir hata oluştu');
    } catch (err) {
      setError('Sunucuya ulaşılamıyor.');
    }
    setLoading(false);
  };

  return (
    <div style={{background:'#fff',borderRadius:16,padding:24,boxShadow:theme.boxShadow,maxWidth:420,margin:'2rem auto'}}>
      <h3 style={{color:theme.neonBlue,marginBottom:12}}>{t('ai_title','Yapay Zeka Token Danışmanı')}</h3>
      <div style={{fontSize:14,marginBottom:12,color:'#444'}}>
        <b>{t('ai_how','Nasıl çalışır?')}</b> {t('ai_how','Kısa bilgiler girerek, projeniz için isim, sembol ve açıklama önerisi alabilirsiniz.')} <span title={t('ai_info','AI önerileri OpenAI ile otomatik üretilir, yatırım tavsiyesi değildir.')}>ⓘ</span>
        <div style={{margin:'8px 0 0 0',fontSize:13}}>{t('ai_examples','Örnek kategori: DeFi, NFT, GameFi | Örnek amaç: Topluluk ödülleri, Oyun içi ekonomi')}</div>
      </div>
      <form onSubmit={handleSubmit}>
        <input value={category} onChange={e=>setCategory(e.target.value)} placeholder={t('ai_category_placeholder','Kategori (ör. DeFi, NFT)')} required style={{width:'100%',marginBottom:8,padding:8}} />
        <input value={purpose} onChange={e=>setPurpose(e.target.value)} placeholder={t('ai_purpose_placeholder','Token Amacı')} required style={{width:'100%',marginBottom:8,padding:8}} />
        <input value={audience} onChange={e=>setAudience(e.target.value)} placeholder={t('ai_audience_placeholder','Hedef Kitle (isteğe bağlı)')} style={{width:'100%',marginBottom:8,padding:8}} />
        <input value={budget} onChange={e=>setBudget(e.target.value)} placeholder={t('ai_budget_placeholder','Bütçe (isteğe bağlı)')} style={{width:'100%',marginBottom:8,padding:8}} />
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button type="submit" disabled={loading} style={{padding:'10px 32px',borderRadius:8,background:theme.neonBlue,color:'#fff',border:'none',fontWeight:'bold',marginTop:8}}>
            {loading ? <span style={{display:'inline-block',width:18,height:18,border:'2px solid #fff',borderTop:'2px solid #1976d2',borderRadius:'50%',animation:'spin 1s linear infinite',verticalAlign:'middle'}} /> : t('ai_suggestion_button','Öneri Al')}
          </button>
          {suggestion && <button type="button" onClick={handleSubmit} disabled={loading} style={{marginLeft:8,padding:'8px 18px',borderRadius:8,background:'#eee',color:theme.neonBlue,border:'none',fontWeight:'bold'}}>{t('ai_refresh','Yenile')}</button>}
        </div>
      </form>
      {suggestion && <div style={{marginTop:16,background:theme.card,padding:12,borderRadius:8,color:theme.text}}>{suggestion}</div>}
      {error && <div style={{marginTop:16,color:theme.error,fontWeight:'bold'}}>{error}</div>}
      <style>{`@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}</style>
    </div>
  );
}
