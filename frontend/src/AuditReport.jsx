import React, { useState } from "react";
import axios from "axios";
import KYCForm from "./KYCForm";
import TokenForm from "./TokenForm";
import TokenGallery from "./TokenGallery";
import AdminKYCPanel from "./AdminKYCPanel";

function AuditReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/audit/token");
      setReport(res.data.report);
    } catch {
      setReport({ error: "Audit alınamadı" });
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>Akıllı Kontrat Audit Raporu</h3>
      <button onClick={handleAudit} disabled={loading}>
        {loading ? "Analiz Ediliyor..." : "Audit Raporu Al"}
      </button>
      {report && (
        <pre style={{ background: "#eee", padding: "1em" }}>
          {JSON.stringify(report, null, 2)}
        </pre>
      )}
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

export default AuditReport;