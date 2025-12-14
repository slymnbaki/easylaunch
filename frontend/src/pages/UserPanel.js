import React, { useEffect, useState } from 'react';
import theme from '../theme';
import TokenDetail from './TokenDetail';


export default function UserPanel({ setGlobalLoading, setToast }) {
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [kycStatus, setKycStatus] = useState('');
  const [kycMessage, setKycMessage] = useState('');
  const [kycPolling, setKycPolling] = useState(null);
  const [balance, setBalance] = useState(null);
  const [user, setUser] = useState(null);
  const userId = localStorage.getItem('userId');


  React.useEffect(() => {
    if (!userId) return;
    setGlobalLoading && setGlobalLoading(true);
    fetch(`/api/tokens?user=${userId}`)
      .then(res => res.json())
      .then(data => {
        setTokens(Array.isArray(data) ? data : data.tokens || []);
      })
      .catch(err => {
        setToast && setToast({ message: 'Tokenler alınamadı: ' + err.message, type: 'error' });
      });
    // KYC polling başlat
    let polling = setInterval(() => {
      fetch(`/api/users/${userId}/kyc-status`)
        .then(res => res.json())
        .then(data => {
          if (data.kycStatus && data.kycStatus !== kycStatus) {
            setKycStatus(data.kycStatus);
            if (data.kycStatus === 'approved') setKycMessage('KYC başvurunuz onaylandı!');
            else if (data.kycStatus === 'rejected') setKycMessage('KYC başvurunuz reddedildi.');
            else setKycMessage('KYC başvurunuz inceleniyor.');
          }
        });
    }, 5000);
    setKycPolling(polling);
    fetch(`/api/users/${userId}/kyc-status`)
      .then(res => res.json())
      .then(data => setKycStatus(data.kycStatus || ''));
    fetch(`/api/users/${userId}/balance`)
      .then(res => res.json())
      .then(data => setBalance(data.balance));
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setGlobalLoading && setGlobalLoading(false);
      })
      .catch(() => {
        setToast && setToast({ message: 'Kullanıcı verisi yüklenemedi!', type: 'error' });
        setGlobalLoading && setGlobalLoading(false);
      });
    return () => { if (polling) clearInterval(polling); };
  }, [userId, setGlobalLoading, setToast]);


  if (!userId) {
    setToast && setToast({ message: 'Giriş yapmalısınız.', type: 'error' });
    return <div style={{color:theme.danger,textAlign:'center',margin:'2rem'}}>Giriş yapmalısınız.</div>;
  }

  if (selectedToken) {
    return <TokenDetail token={selectedToken} />;
  }

  return (
    <section style={{padding:'2rem 0',textAlign:'center',background:'var(--bg-main)',minHeight:'60vh'}}>
      <h2 style={{color:theme.neonPurple,fontSize:'2.2rem',marginBottom:12}}>Kullanıcı Paneli</h2>
      <div style={{marginBottom:16,color:theme.textSecondary}}>
        <b>KYC Durumu:</b> <span style={{color:kycStatus==='approved'?theme.neonGreen:kycStatus==='rejected'?theme.danger:theme.warning,fontWeight:'bold'}}>{kycStatus || 'Bilinmiyor'}</span><br/>
        {kycMessage && <div style={{margin:'8px 0',color:kycStatus==='approved'?theme.neonGreen:kycStatus==='rejected'?theme.danger:theme.warning,fontWeight:'bold'}}>{kycMessage}</div>}
        <b>Bakiye:</b> {balance !== null ? balance : '-'}
      </div>
      {/* Yükleniyor ve hata mesajları merkezi olarak yönetiliyor */}
      {user && (
        <ul style={{fontSize:17,lineHeight:2}}>
          <li><b>Ad Soyad:</b> {user.name || 'Bilinmiyor'}</li>
          <li><b>Email:</b> {user.email || 'Bilinmiyor'}</li>
          <li><b>Wallet:</b> {user.walletAddress ? user.walletAddress.slice(0,8)+'...'+user.walletAddress.slice(-4) : 'Bağlı değil'}</li>
          <li><b>KYC Durumu:</b> {user.kycStatus || 'Onaysız'}</li>
          <li><b>Katıldığı Launchpad:</b> {user.launchpads?.length || 0}</li>
          <li><b>Oluşturulan Token:</b> {user.tokens?.length || 0}</li>
        </ul>
      )}
      <h3 style={{color:theme.neonCyan,margin:'2rem 0 1rem'}}>Tokenlerim</h3>
      <div className="token-gallery-grid">
        {tokens.length === 0 && <div style={{color:theme.textSecondary}}>Henüz tokeniniz yok.</div>}
        {tokens.map(token => (
          <div key={token._id || token.address} className="token-card">
            <div style={{fontSize:18,fontWeight:'bold',color:theme.neonBlue,marginBottom:8}}>{token.name} <span style={{color:theme.textSecondary}}>[{token.symbol}]</span></div>
            <div style={{fontSize:14,color:theme.textSecondary,marginBottom:8}}>Arz: {token.supply}</div>
            <div style={{fontSize:13,color:theme.textSecondary,marginBottom:8}}>Ağ: {token.network}</div>
            <a href={`https://sepolia.etherscan.io/address/${token.address}`} target="_blank" rel="noopener noreferrer" style={{color:theme.neonCyan,fontSize:13,marginBottom:8}}>Explorer</a>
            <button onClick={()=>setSelectedToken(token)} style={{marginTop:8,padding:'8px 18px',borderRadius:8,background:theme.buttonGradient,color:'#fff',border:'none',fontWeight:'bold',boxShadow:theme.buttonGlow}}>Detay</button>
          </div>
        ))}
      </div>
      <button onClick={handleUpdate} style={{marginTop:24,padding:'10px 24px',borderRadius:8,background:'var(--accent-cyan)',color:'#fff',fontWeight:600,border:'none'}}>Bilgileri Güncelle</button>
    </section>
  );
}
