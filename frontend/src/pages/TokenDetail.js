
import React, { useEffect, useState } from 'react';
import theme from '../theme';
import AuditHistory from '../components/AuditHistory';


export default function TokenDetail({ token, setGlobalLoading, setToast }) {
  const [balance, setBalance] = useState(null);
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    if (!token?.address) return;
    setGlobalLoading && setGlobalLoading(true);
    fetch(`/api/tokens/${token.address}/balance`)
      .then(res => res.json())
      .then(data => {
        setBalance(data.balance);
        setGlobalLoading && setGlobalLoading(false);
      })
      .catch(err => {
        setToast && setToast({ message: 'Bakiye alınamadı: ' + err.message, type: 'error' });
        setGlobalLoading && setGlobalLoading(false);
      });
    fetch(`/api/tokens/${token.address}/transfers`)
      .then(res => res.json())
      .then(data => setTransfers(data.transfers || []));
  }, [token, setGlobalLoading, setToast]);

  if (!token) return null;

  return (
    <section style={{padding:'2rem 0',textAlign:'center',background:'var(--bg-main)',minHeight:'40vh'}}>
      <h2 style={{color:theme.neonBlue,fontSize:'2rem',marginBottom:12}}>{token.name} [{token.symbol}]</h2>
      <div style={{color:theme.textSecondary,fontSize:15,marginBottom:8}}>Adres: <a href={`https://sepolia.etherscan.io/address/${token.address}`} target="_blank" rel="noopener noreferrer" style={{color:theme.neonCyan}}>{token.address}</a></div>
      <div style={{color:theme.textSecondary,fontSize:15,marginBottom:8}}>Sahip: {token.owner}</div>
      <div style={{color:theme.textSecondary,fontSize:15,marginBottom:8}}>Arz: {token.supply}</div>
      <div style={{color:theme.textSecondary,fontSize:15,marginBottom:8}}>Ağ: {token.network}</div>
      {/* Yükleniyor ve hata mesajları merkezi olarak yönetiliyor */}
      <div style={{color:theme.success,fontWeight:'bold'}}>Bakiye: {balance}</div>
      <AuditHistory tokenAddress={token.address} />
      <h3 style={{color:theme.neonPurple,marginTop:24}}>Transfer Geçmişi</h3>
      <div style={{overflowX:'auto',maxWidth:600,margin:'0 auto'}}>
        <table style={{width:'100%',fontSize:14}}>
          <thead>
            <tr style={{color:theme.textSecondary}}>
              <th>Tx Hash</th>
              <th>Miktar</th>
              <th>Alıcı</th>
              <th>Tarih</th>
            </tr>
          </thead>
          <tbody>
            {transfers.length === 0 ? (
              <tr><td colSpan={4} style={{textAlign:'center',color:theme.textSecondary}}>Transfer yok.</td></tr>
            ) : (
              transfers.map(tx => (
                <tr key={tx.txHash}>
                  <td><a href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} target="_blank" rel="noopener noreferrer" style={{color:theme.neonCyan}}>{tx.txHash.slice(0,10)}...</a></td>
                  <td>{tx.amount}</td>
                  <td>{tx.to}</td>
                  <td>{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
