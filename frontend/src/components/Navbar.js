import React from 'react';
export default function Navbar({ walletAddress, onConnect, network }) {
  return (
    <nav style={{
      display:'flex',alignItems:'center',justifyContent:'space-between',padding:'1rem 2rem',
      background:'var(--bg-main)',
      borderBottom:'1.5px solid var(--accent-blue)',
      position:'sticky',top:0,zIndex:10
    }}>
      <div style={{display:'flex',alignItems:'center',gap:28}}>
        <img src="/logo512.svg" alt="Easylaunch Logo" style={{height:54,width:54,borderRadius:'50%',boxShadow:'0 4px 24px #38bdf855, 0 1.5px 8px #0002',border:'3px solid #fff',background:'#fff',objectFit:'cover',transition:'transform 0.2s'}} />
        <span style={{fontWeight:'bold',fontSize:22,letterSpacing:1.5,color:'#0f172a',textShadow:'0 2px 8px #fff'}}>Easylaunch</span>
      </div>
      <div style={{display:'flex',gap:20,alignItems:'center'}}>
        <a href="/" style={{fontWeight:'bold',color:'#0f172a',textDecoration:'none',fontSize:18,letterSpacing:1,marginLeft:12,textShadow:'0 2px 8px #fff'}}>Ana Sayfa</a>
        <a href="/token-create" style={{fontWeight:'bold',color:'#0f172a',textDecoration:'none',fontSize:18,letterSpacing:1,textShadow:'0 2px 8px #fff'}}>Token Oluştur</a>
        <a href="/nft-mint" style={{fontWeight:'bold',color:'#0f172a',textDecoration:'none',fontSize:18,letterSpacing:1,textShadow:'0 2px 8px #fff'}}>NFT Üret</a>
        <a href="/kyc" style={{fontWeight:'bold',color:'#0f172a',textDecoration:'none',fontSize:18,letterSpacing:1,textShadow:'0 2px 8px #fff'}}>KYC</a>
        <a href="/dashboard" style={{fontWeight:'bold',color:'#0f172a',textDecoration:'none',fontSize:18,letterSpacing:1,textShadow:'0 2px 8px #fff'}}>Dashboard</a>
        <a href="/launchpad" style={{fontWeight:'bold',color:'#0f172a',textDecoration:'none',fontSize:18,letterSpacing:1,textShadow:'0 2px 8px #fff'}}>Launchpad</a>
        <a href="/admin" style={{fontWeight:'bold',color:'#0f172a',textDecoration:'none',fontSize:18,letterSpacing:1,textShadow:'0 2px 8px #fff'}}>Admin</a>
        <a href="/user" style={{fontWeight:'bold',color:'#0f172a',textDecoration:'none',fontSize:18,letterSpacing:1,textShadow:'0 2px 8px #fff'}}>Kullanıcı Paneli</a>
        <a href="/feedback" style={{fontWeight:'bold',color:'#0f172a',textDecoration:'none',fontSize:18,letterSpacing:1,textShadow:'0 2px 8px #fff'}}>Feedback</a>
        <a href="/analytics" style={{fontWeight:'bold',color:'#0f172a',textDecoration:'none',fontSize:18,letterSpacing:1,textShadow:'0 2px 8px #fff'}}>Analytics</a>
        <a href="/apikey" style={{fontWeight:'bold',color:'#0f172a',textDecoration:'none',fontSize:18,letterSpacing:1,textShadow:'0 2px 8px #fff'}}>API Key</a>
        {/* <a href="/docs" style={{fontWeight:'bold',color:'#0f172a',textDecoration:'none',fontSize:18,letterSpacing:1,textShadow:'0 2px 8px #fff'}}>Dokümantasyon</a> */}
      </div>
      <div style={{display:'flex',alignItems:'center',gap:16}}>
        <span style={{fontSize:13,color:'#22d3ee',background:'#0f172a',padding:'4px 10px',borderRadius:8,border:'1px solid #22d3ee'}}>
          Ağ: {network || 'Bilinmiyor'}
        </span>
        {walletAddress ? (
          <span style={{fontWeight:'bold',color:'#4ade80',background:'#0f172a',padding:'4px 10px',borderRadius:8}}>{walletAddress.slice(0,6)}...{walletAddress.slice(-4)}</span>
        ) : (
          <button onClick={onConnect} style={{padding:'8px 16px',borderRadius:8,background:'#38bdf8',color:'#fff',fontWeight:600,border:'none',cursor:'pointer'}}>Cüzdanı Bağla</button>
        )}
      </div>
    </nav>
  );
}
