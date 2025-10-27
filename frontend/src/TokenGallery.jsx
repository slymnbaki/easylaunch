import React, { useEffect, useState } from "react";

export default function TokenGallery() {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    fetch("https://localhost:3001/api/tokens")
      .then(res => res.json())
      .then(data => setTokens(data.tokens));
  }, []);

  return (
    <div>
      <h3>Tüm Tokenler</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {tokens.map(token => (
          <div key={token.id} style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            minWidth: 200,
            background: "#fafafa"
          }}>
            <b>{token.name} ({token.symbol})</b>
            <div>Açıklama: {token.desc}</div>
            <div>Adres: <a href={`https://sepolia.etherscan.io/address/${token.address}`} target="_blank" rel="noopener noreferrer">{token.address}</a></div>
          </div>
        ))}
      </div>
    </div>
  );
}