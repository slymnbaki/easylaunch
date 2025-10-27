import React, { useEffect, useState } from "react";
import axios from "axios";

export default function TokenList({ onSelect }) {
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    let mounted = true;
    axios
      .get("/api/tokens")
      .then(res => { if (mounted) setTokens(res.data || []); })
      .catch(() => { if (mounted) setTokens([]); });
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h2>Tokens</h2>
      <ul>
        {tokens.map(t => (
          <li key={t.address}>
            <button type="button" onClick={() => onSelect?.(t)}>{t.name} ({t.symbol})</button>
          </li>
        ))}
      </ul>
    </div>
  );
}