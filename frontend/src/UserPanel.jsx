import React, { useEffect, useState } from "react";
import axios from "axios";
import TokenDetail from "./TokenDetail";

function UserPanel() {
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios.get(`/api/tokens/user/${userId}`)
      .then(res => setTokens(res.data))
      .catch(() => setTokens([]));
  }, [userId]);

  return (
    <div>
      <h3>Kullanıcı Paneli</h3>
      <h4>Oluşturduğun Tokenler</h4>
      <ul>
        {tokens.map(token => (
          <li key={token._id}>
            {token.name} ({token.symbol}) - {token.address}
            <button onClick={() => setSelectedToken(token)}>Detay</button>
          </li>
        ))}
      </ul>
      {selectedToken && (
        <div>
          <TokenDetail token={selectedToken} />
          <button onClick={() => setSelectedToken(null)}>Detayı Kapat</button>
        </div>
      )}
    </div>
  );
}

export default UserPanel;