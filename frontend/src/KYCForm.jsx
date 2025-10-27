import React, { useState } from "react";
import axios from "axios";

function KYCForm() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Örnek: userId'yi localStorage'dan al
  const userId = localStorage.getItem("userId");

  const handleKYC = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/users/kyc-request", { userId });
      setStatus("Başvurunuz alındı, inceleniyor.");
    } catch {
      setStatus("Bir hata oluştu.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>KYC Başvurusu</h3>
      <form onSubmit={handleKYC}>
        <button type="submit" disabled={loading}>
          {loading ? "Gönderiliyor..." : "KYC Başvurusu Yap"}
        </button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

export default KYCForm;