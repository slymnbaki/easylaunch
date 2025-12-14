import React, { useEffect, useState } from 'react';
import theme from '../theme';

export default function AuditHistory({ tokenAddress }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!tokenAddress) return;
    setLoading(true);
    fetch(`/api/audit/history/${tokenAddress}`)
      .then(res => res.json())
      .then(data => {
        setHistory(data.history || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Audit geçmişi alınamadı: ' + err.message);
        setLoading(false);
      });
  }, [tokenAddress]);

  if (!tokenAddress) return null;
  if (loading) return <div style={{color:theme.textSecondary}}>Audit geçmişi yükleniyor...</div>;
  if (error) return <div style={{color:theme.danger}}>{error}</div>;

  return (
    <div style={{marginTop:32}}>
      <h3 style={{color:theme.neonPurple}}>Audit Geçmişi</h3>
      {history.length === 0 ? (
        <div style={{color:theme.textSecondary}}>Audit geçmişi yok.</div>
      ) : (
        <ul style={{fontSize:15,lineHeight:1.7}}>
          {history.map((item, i) => (
            <li key={i} style={{marginBottom:8}}>
              <b>{new Date(item.timestamp).toLocaleString()}:</b> {item.summary || item.details || 'Detay yok.'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
