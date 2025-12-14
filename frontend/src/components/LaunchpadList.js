import React from 'react';
import theme from '../theme';


export default function LaunchpadList({ projects = [] }) {
  return (
    <div style={{maxWidth:700,margin:'2rem auto',background:theme.cardSecondary,borderRadius:16,padding:'2rem 1rem',boxShadow:theme.borderGlow}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <h3 style={{color:theme.neonCyan,margin:0}}>Projeler</h3>
        <select style={{background:theme.background,color:theme.text,border:'1px solid '+theme.neonCyan,borderRadius:8,padding:'6px 12px'}}>
          <option>Hepsi</option>
          <option>Sepolia</option>
          <option>BSC</option>
          <option>Polygon</option>
          <option>Avalanche</option>
          <option>Holesky</option>
          <option>Mainnet</option>
        </select>
      </div>
      {projects.length === 0 ? (
        <div style={{color:theme.textSecondary,textAlign:'center',padding:'2rem 0'}}>Henüz aktif launchpad yok.</div>
      ) : (
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr style={{color:theme.textSecondary,fontWeight:'bold',fontSize:15}}>
              <td style={{padding:'8px 0'}}>Proje Adı</td>
              <td>Ağ</td>
              <td>Durum</td>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p._id || p.name} style={{borderTop:'1px solid #222'}}>
                <td style={{padding:'10px 0',color:theme.text,fontWeight:'bold'}}>{p.name}</td>
                <td style={{color:theme.neonBlue}}>{p.network}</td>
                <td>
                  <span style={{background:theme[p.statusColor]||theme.neonBlue,color:'#fff',padding:'4px 12px',borderRadius:8,fontWeight:'bold',fontSize:14}}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
