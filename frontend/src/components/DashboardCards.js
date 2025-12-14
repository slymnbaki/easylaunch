import React from 'react';



export default function DashboardCards({ stats }) {
  const cards = [
    { label: 'Toplam Token', value: stats?.tokenCount ?? '-', color: '#38bdf8' },
    { label: 'Toplam Kullanıcı', value: stats?.userCount ?? '-', color: '#22d3ee' },
    { label: 'KYC Bekleyen', value: stats?.kycPending ?? '-', color: '#facc15' },
    { label: 'Aktif Launchpad', value: stats?.launchpadCount ?? '-', color: '#a855f7' },
  ];
  return (
    <div style={{display:'flex',gap:24,justifyContent:'center',flexWrap:'wrap',margin:'2rem 0'}}>
      {cards.map(card => (
        <div key={card.label} style={{
          background:'#f3f4f6',
          color:'#222',
          borderRadius:14,
          minWidth:180,
          padding:'1.5rem 2rem',
          boxShadow:`0 0 0 2px ${card.color}55, 0 2px 16px #0002`,
          border:`1.5px solid ${card.color}`,
          textAlign:'center',
        }}>
          <div style={{fontSize:32,fontWeight:'bold',color:card.color,marginBottom:8}}>{card.value}</div>
          <div style={{fontSize:16,letterSpacing:1}}>{card.label}</div>
        </div>
      ))}
    </div>
  );
}
