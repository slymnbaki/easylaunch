import React, { useEffect, useState } from "react";
import axios from "axios";
import KYCForm from "./KYCForm";
import TokenForm from "./TokenForm";
import TokenGallery from "./TokenGallery";

function AdminKYCPanel() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/api/users/kyc-list")
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data.users || [];
        setUsers(data);
      })
      .catch(() => setUsers([]));
  }, []);

  const handleApprove = async (id) => {
    await axios.post(`/api/users/kyc-approve/${id}`);
    setUsers(users.map(u => u._id === id ? { ...u, kycStatus: "approved" } : u));
  };

  const handleReject = async (id) => {
    await axios.post(`/api/users/kyc-reject/${id}`);
    setUsers(users.map(u => u._id === id ? { ...u, kycStatus: "rejected" } : u));
  };

  return (
    <div>
      <h3>KYC Başvuruları (Admin)</h3>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>KYC Durumu</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.kycStatus}</td>
              <td>
                {u.kycStatus === "pending" && (
                  <>
                    <button onClick={() => handleApprove(u._id)}>Onayla</button>
                    <button onClick={() => handleReject(u._id)}>Reddet</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  return (
    <div>
      <KYCForm />
      <hr />
      <TokenForm />
      <hr />
      <TokenGallery />
      <hr />
      <AdminKYCPanel />
    </div>
  );
}

export default App;