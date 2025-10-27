import React, { useState, useEffect } from "react";
import axios from "axios";

function TokenDetail({ token }) {
  const [showTransfer, setShowTransfer] = useState(false);

  return (
    <div>
      <h2>{token.name} Detayları</h2>
      <p>Adres: {token.address}</p>
      <p>Bakiye: {token.balance}</p>
      <button onClick={() => setShowTransfer(true)}>Transfer Et</button>

      {showTransfer && (
        <TokenTransferModal
          token={token}
          onClose={() => setShowTransfer(false)}
        />
      )}
    </div>
  );
}

function TokenTransferModal({ token, onClose }) {
  const [amount, setAmount] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // call API / blockchain transfer here
      onClose?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Transfer: {token.name}</h3>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="To address"
            value={toAddress}
            onChange={(e) => setToAddress(e.target.value)}
          />
          <input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Gönderiliyor..." : "Transfer Et"}
          </button>
          <button type="button" onClick={onClose}>
            Kapat
          </button>
        </form>
      </div>
    </div>
  );
}

export default TokenDetail;