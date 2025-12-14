import React, { useState } from "react";
import axios from "axios";

const networks = ["Sepolia", "Holesky", "Mainnet", "BSC", "Polygon", "Avalanche"];


const Swap = ({ setGlobalLoading, setToast }) => {
  const [fromToken, setFromToken] = useState("");
  const [toToken, setToToken] = useState("");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [network, setNetwork] = useState(networks[0]);
  const [result, setResult] = useState(null);

  const handleSwap = async (e) => {
    e.preventDefault();
    setGlobalLoading && setGlobalLoading(true);
    try {
      // Dummy user IDs, replace with actual user context
      const res = await axios.post("/api/swap", {
        fromUserId: "user1", // TODO: Replace with logged-in user
        toUserId: "user2",   // TODO: Replace with selected user
        fromToken,
        toToken,
        fromAmount,
        toAmount,
        network,
      });
      setResult(res.data);
      if (res.data.success) {
        setToast && setToast({ message: res.data.message || 'Swap işlemi başarılı!', type: 'success' });
      } else {
        setToast && setToast({ message: res.data.error || 'Swap işlemi başarısız!', type: 'error' });
      }
    } catch (err) {
      setResult({ error: err?.response?.data?.error || "Swap işlemi sırasında hata oluştu." });
      setToast && setToast({ message: err?.response?.data?.error || "Swap işlemi sırasında hata oluştu.", type: 'error' });
    }
    setGlobalLoading && setGlobalLoading(false);
  };

  return (
    <div className="container">
      <h2>Token Swap / Alım-Satım</h2>
      <form onSubmit={handleSwap} className="swap-form">
        <div>
          <label>From Token:</label>
          <input value={fromToken} onChange={e => setFromToken(e.target.value)} placeholder="Token adresi veya 'native'" required />
        </div>
        <div>
          <label>To Token:</label>
          <input value={toToken} onChange={e => setToToken(e.target.value)} placeholder="Token adresi veya 'native'" required />
        </div>
        <div>
          <label>From Amount:</label>
          <input type="number" value={fromAmount} onChange={e => setFromAmount(e.target.value)} required />
        </div>
        <div>
          <label>To Amount:</label>
          <input type="number" value={toAmount} onChange={e => setToAmount(e.target.value)} required />
        </div>
        <div>
          <label>Network:</label>
          <select value={network} onChange={e => setNetwork(e.target.value)}>
            {networks.map(net => <option key={net} value={net}>{net}</option>)}
          </select>
        </div>
        <button type="submit">Swap</button>
      </form>
      {result && (
        <div className="swap-result">
          {result.success ? (
            <span className="success">{result.message}</span>
          ) : (
            <span className="error">{result.error}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default Swap;
