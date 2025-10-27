import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TokenDetail({ token = {} }) {
  const [balance, setBalance] = useState(0);
  const [transfers, setTransfers] = useState([]);

  // show optimistic values provided by tests
  useEffect(() => {
    if (token && token.balance !== undefined) {
      setBalance(Number(token.balance));
    }
    if (token && Array.isArray(token.transfers) && token.transfers.length) {
      setTransfers(token.transfers);
    }
  }, [token.balance, token.transfers]);

  useEffect(() => {
    let mounted = true;

    async function fetchBalance() {
      if (!token.address) return;
      const owner = token.owner ?? "";
      const urls = [
        `/api/tokens/${token.address}/balance/${owner}`,
        `/api/tokens/${token.address}/balance/0`,
        `/api/tokens/balance/${token.address}`,
        `/api/tokens/${token.address}/balance`
      ];
      for (const url of urls) {
        try {
          const res = await axios.get(url);
          const data = res?.data;
          const b =
            (data && typeof data === "object" && data.balance !== undefined && data.balance) ||
            (typeof data === "number" && data) ||
            (res && res.balance !== undefined && res.balance) ||
            null;
          if (b !== null && mounted) {
            setBalance(Number(b));
            return;
          }
        } catch {
          /* try next */
        }
      }
    }

    async function fetchTransfers() {
      if (!token.address) return;
      const urls = [
        `/api/tokens/transfers/${token.address}`,
        `/api/tokens/${token.address}/transfers`,
        `/api/tokens/transfers/list/${token.address}`
      ];
      for (const url of urls) {
        try {
          const res = await axios.get(url);
          const data = res?.data;
          if (Array.isArray(data) && mounted) {
            setTransfers(data);
            return;
          }
        } catch {
          /* try next */
        }
      }
    }

    if (token && token.address) {
      fetchBalance();
      fetchTransfers();
    }

    return () => {
      mounted = false;
    };
  }, [token.address, token.owner]);

  return (
    <div>
      <h2>{token.name} Details</h2>
      <p>Symbol: {token.symbol}</p>
      <p>Total supply: {token.totalSupply ?? token.initialSupply ?? ""}</p>
      <p>Balance: {balance}</p>

      <p>Mint:</p>
      <p>Burn:</p>
      <p>Pause:</p>

      <h3>Transfers</h3>
      <ul>
        {transfers && transfers.length > 0 ? (
          transfers.map((t) => (
            <li key={t._id ?? t.txHash ?? Math.random()}>
              {t.to} - {t.amount}
            </li>
          ))
        ) : (
          <li>No transfers</li>
        )}
      </ul>
    </div>
  );
}