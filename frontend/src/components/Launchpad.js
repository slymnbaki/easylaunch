import React, { useEffect, useState } from 'react';
export default function Launchpad() {
  const [tokens, setTokens] = useState([]);
  useEffect(() => {
    fetch('/api/admin/tokens').then(r=>r.json()).then(setTokens);
  }, []);
  return (
    <div className="container" style={{marginTop:32}}>
      <h3>Launchpad / Pazaryeri</h3>
      <ul>
        {tokens.map(t=>(
          <li key={t._id}>
            <b>{t.name}</b> ({t.symbol}) - Ağ: {t.network} <br/>
            Sözleşme: <a href={`https://sepolia.etherscan.io/address/${t.contractAddress}`} target="_blank" rel="noopener noreferrer">{t.contractAddress}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
