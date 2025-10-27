import React, { useState } from "react";
import axios from "axios";

function TokenTransferForm() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/tokens/transfer", {
        tokenAddress,
        to,
        amount,
      });
      setSuccess("Transfer başarılı!");
      setError("");
    } catch {
      setError("Transfer başarısız!");
      setSuccess("");
    }
  };

  return (
    <div>
      <h3>Token Transferi</h3>
      <form onSubmit={handleTransfer}>
        <input value={tokenAddress} onChange={e => setTokenAddress(e.target.value)} placeholder="Token Adresi" required />
        <input value={to} onChange={e => setTo(e.target.value)} placeholder="Alıcı Adresi" required />
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Miktar" required />
        <button type="submit">Transfer Et</button>
      </form>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default TokenTransferForm;