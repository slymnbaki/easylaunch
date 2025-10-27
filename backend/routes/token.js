import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function TokenForm() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [initialSupply, setInitialSupply] = useState(1000);
  const [canMint, setCanMint] = useState(false);
  const [canPause, setCanPause] = useState(false);
  const [canBurn, setCanBurn] = useState(false);
  const [network, setNetwork] = useState("sepolia");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/tokens/create-token", {
        name,
        symbol,
        initialSupply,
        canMint,
        canPause,
        canBurn,
        network,
      });

      setSuccess("Token başarıyla oluşturuldu!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError("Token oluşturulurken bir hata oluştu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Yeni Token Oluştur</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Token Adı"
          required
        />
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          placeholder="Sembol"
          required
        />
        <input
          type="number"
          value={initialSupply}
          onChange={(e) => setInitialSupply(e.target.value)}
          placeholder="Başlangıç Arzı"
          required
        />
        <label>
          <input
            type="checkbox"
            checked={canMint}
            onChange={(e) => setCanMint(e.target.checked)}
          />{" "}
          Mint
        </label>
        <label>
          <input
            type="checkbox"
            checked={canPause}
            onChange={(e) => setCanPause(e.target.checked)}
          />{" "}
          Pause
        </label>
        <label>
          <input
            type="checkbox"
            checked={canBurn}
            onChange={(e) => setCanBurn(e.target.checked)}
          />{" "}
          Burn
        </label>
        <select
          value={network}
          onChange={(e) => setNetwork(e.target.value)}
        >
          <option value="sepolia">Ethereum Sepolia</option>
          <option value="bscTestnet">BSC Testnet</option>
          <option value="polygonMumbai">Polygon Mumbai</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Oluşturuluyor..." : "Token Oluştur"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default TokenForm;
const express = require("express");
const router = express.Router();

// Simple in-memory token store for backend tests / dev
let tokens = [
  { address: "0x1", name: "TestToken", symbol: "TTK", totalSupply: "1000" }
];

// GET /api/tokens -> list tokens
router.get("/", (req, res) => {
  return res.json(tokens);
});

// POST /api/tokens -> create a token (body: name,symbol,totalSupply,address)
router.post("/", (req, res) => {
  const { name, symbol, totalSupply, address } = req.body || {};
  if (!name || !symbol) return res.status(400).json({ success: false, message: "Missing fields" });
  const addr = address || `0x${Date.now().toString(16)}`;
  const t = { address: addr, name, symbol, totalSupply: totalSupply ?? "0" };
  tokens.push(t);
  return res.json({ success: true, token: t });
});

// GET /api/tokens/:address/balance/:user -> mock balance (used by frontend/tests)
router.get("/:address/balance/:user", (req, res) => {
  return res.json({ balance: "5000" });
});

// GET /api/tokens/:address/transfers -> mock transfers list
router.get("/:address/transfers", (req, res) => {
  return res.json([
    { _id: "1", amount: 100, to: "0xabc", txHash: "0xtxhash1", createdAt: new Date().toISOString() }
  ]);
});

module.exports = router;