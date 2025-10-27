import React, { useState } from "react";
import axios from "axios";

function LaunchpadBuyForm() {
  const [launchpadId, setLaunchpadId] = useState("");
  const [amount, setAmount] = useState("");
  const [buyer, setBuyer] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleBuy = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/launchpad/buy", {
        launchpadId,
        amount,
        buyer,
      });
      setSuccess("Satın alma başarılı!");
      setError("");
    } catch {
      setError("Satın alma başarısız!");
      setSuccess("");
    }
  };

  return (
    <div>
      <h3>Launchpad Katılımı</h3>
      <form onSubmit={handleBuy}>
        <input value={launchpadId} onChange={e => setLaunchpadId(e.target.value)} placeholder="Launchpad ID" required />
        <input value={buyer} onChange={e => setBuyer(e.target.value)} placeholder="Alıcı Adresi" required />
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Miktar" required />
        <button type="submit">Satın Al</button>
      </form>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LaunchpadBuyForm;