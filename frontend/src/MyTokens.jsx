import React, { useEffect, useState } from "react";

export default function MyTokens({ username }) {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_API_URL || "";
    fetch(`${API_URL}/api/tokens?user=${username}`)
      .then(res => res.json())
      .then(data => {
        const tokens = Array.isArray(data) ? data : data.tokens || [];
        setTokens(tokens);
      });
  }, [username]);

  return (
    <div>
      <h3>Tokenlerim</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        {tokens.length === 0 && <div>Henüz tokeniniz yok.</div>}
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