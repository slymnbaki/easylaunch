import React, { useEffect, useState } from "react";
import axios from "axios";

function PurchaseHistoryPanel() {
  const [purchases, setPurchases] = useState([]);
  const buyer = localStorage.getItem("userAddress"); // veya userId

  useEffect(() => {
    axios.get(`/api/launchpad/purchases/${buyer}`)
      .then(res => setPurchases(res.data))
      .catch(() => setPurchases([]));
  }, [buyer]);

  return (
    <div>
      <h3>Satın Alma Geçmişim</h3>
      <table>
        <thead>
          <tr>
            <th>Launchpad ID</th>
            <th>Miktar</th>
            <th>Tx Hash</th>
            <th>Tarih</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map(p => (
            <tr key={p._id}>
              <td>{p.launchpadId}</td>
              <td>{p.amount}</td>
              <td>
                <a href={`https://sepolia.etherscan.io/tx/${p.txHash}`} target="_blank" rel="noopener noreferrer">
                  {p.txHash.slice(0, 10)}...
                </a>
              </td>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PurchaseHistoryPanel;