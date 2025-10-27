import React, { useEffect, useState } from "react";
import TokenGallery from "./TokenGallery";
import TokenList from "./TokenList";
import TokenDetail from "./TokenDetail";
import TokenTransferModal from "./TokenTransferModal";

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [showTransfer, setShowTransfer] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
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
      <TokenGallery />
      <TokenList onSelect={(t) => setSelectedToken(t)} />

      {selectedToken && <TokenDetail token={selectedToken} />}

      <button onClick={() => setShowTransfer(true)} disabled={!selectedToken}>
        Transfer
      </button>

      {showTransfer && (
        <TokenTransferModal
          token={selectedToken}
          onClose={() => setShowTransfer(false)}
        />
      )}
    </div>
  );
}