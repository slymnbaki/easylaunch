import React, { useState } from "react";

export default function TokenForm({ userAddress, onCreate, paymentMethod, setPaymentMethod }) {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [desc, setDesc] = useState("");
  const [suggestion, setSuggestion] = useState("");

  const getSuggestion = async () => {
    const response = await fetch("https://localhost:3001/api/ai-token-suggestion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: desc }),
    });
    const data = await response.json();
    setSuggestion(data.suggestion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name, symbol, desc, userAddress, paymentMethod });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Token adı"
          required
        />
        <input
          value={symbol}
          onChange={e => setSymbol(e.target.value)}
          placeholder="Token sembolü"
          required
        />
        <input
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Token açıklaması"
        />
        <button type="button" onClick={getSuggestion}>AI ile isim/simge öner</button>
        {suggestion && <div>Öneri: {suggestion}</div>}
        <div>
          <label>
            <input
              type="radio"
              name="payment"
              value="normal"
              checked={paymentMethod === "normal"}
              onChange={() => setPaymentMethod("normal")}
            />
            Normal Ödeme
          </label>
          <label>
            <input
              type="radio"
              name="payment"
              value="ELT"
              checked={paymentMethod === "ELT"}
              onChange={() => setPaymentMethod("ELT")}
            />
            ELT ile Ödeme (%5 indirim)
          </label>
        </div>
        <button type="submit">Token Oluştur</button>
      </form>
    </div>
  );
}