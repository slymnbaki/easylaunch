import React, { useEffect, useState } from "react";
import TokenGallery from "./TokenGallery"; // Import TokenGallery component

export default function App() {
  const [user, setUser] = useState(null);

  // Simulate user login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Fetch user data using the token
      fetch("https://localhost:3001/api/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUser(data.username));
    }
  }, []);

  return (
    <div>
      <h1>Welcome to the Token App</h1>
      {user ? (
        <div>
          <h2>Hello, {user}!</h2>
        </div>
      ) : (
        <div>
          <h2>Please log in</h2>
          {/* Login form or button here */}
        </div>
      )}
      <TokenGallery /> {/* Render TokenGallery component */}
    </div>
  );
}

export function MyTokens({ username }) {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    fetch(`https://localhost:3001/api/tokens?user=${username}`)
      .then(res => res.json())
      .then(data => setTokens(data.tokens));
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

export function TokenGallery() {
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