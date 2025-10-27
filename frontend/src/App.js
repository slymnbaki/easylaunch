import React from "react";
import KYCForm from "./KYCForm";
import TokenForm from "./TokenForm";
import TokenGallery from "./TokenGallery";
import AdminKYCPanel from "./AdminKYCPanel";
import AuditReport from "./AuditReport";
import LaunchpadForm from "./LaunchpadForm";
import LaunchpadGallery from "./LaunchpadGallery";
import AdminStatsPanel from "./AdminStatsPanel";
import UserPanel from "./UserPanel";
import TokenTransferForm from "./TokenTransferForm";
import PurchaseHistoryPanel from "./PurchaseHistoryPanel";

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
      <hr />
      <AuditReport />
      <hr />
      <LaunchpadForm />
      <hr />
      <LaunchpadGallery />
      <hr />
      <AdminStatsPanel />
      <hr />
      <UserPanel />
      <hr />
      <TokenTransferForm />
      <hr />
      <PurchaseHistoryPanel />
    </div>
  );
}

export default App;
