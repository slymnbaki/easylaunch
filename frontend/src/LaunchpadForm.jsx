import React, { useState } from "react";
import axios from "axios";

function LaunchpadForm() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [saleStart, setSaleStart] = useState("");
  const [saleEnd, setSaleEnd] = useState("");
  const [price, setPrice] = useState("");
  const [hardCap, setHardCap] = useState("");
  const [softCap, setSoftCap] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/launchpad/create", {
        tokenAddress,
        saleStart,
        saleEnd,
        price,
        hardCap,
        softCap,
      });
      setSuccess("Launchpad başarıyla oluşturuldu!");
      setError("");
    } catch {
      setError("Launchpad oluşturulamadı.");
      setSuccess("");
    }
  };

  return (
    <div>
      <h3>Launchpad Oluştur</h3>
      <form onSubmit={handleSubmit}>
        <input value={tokenAddress} onChange={e => setTokenAddress(e.target.value)} placeholder="Token Adresi" required />
        <input type="datetime-local" value={saleStart} onChange={e => setSaleStart(e.target.value)} required />
        <input type="datetime-local" value={saleEnd} onChange={e => setSaleEnd(e.target.value)} required />
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Token Fiyatı" required />
        <input type="number" value={hardCap} onChange={e => setHardCap(e.target.value)} placeholder="Hard Cap" required />
        <input type="number" value={softCap} onChange={e => setSoftCap(e.target.value)} placeholder="Soft Cap" required />
        <button type="submit">Launchpad Oluştur</button>
      </form>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LaunchpadForm;