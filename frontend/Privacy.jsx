import React from "react";
import { Routes, Route } from "react-router-dom";
import Terms from "./Terms";
import ResetPassword from "./ResetPassword";

export default function Privacy() {
  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 24 }}>
      <h2>Gizlilik Politikası</h2>
      <p>
        Kişisel verileriniz KVKK ve GDPR kapsamında korunur. Bilgileriniz üçüncü kişilerle paylaşılmaz.
        Detaylı bilgi için bu sayfayı inceleyebilirsiniz.
      </p>
      {/* Detaylı metninizi buraya ekleyebilirsiniz */}
    </div>
  );
}

<Routes>
  <Route path="/terms" element={<Terms />} />
  <Route path="/privacy" element={<Privacy />} />
  <Route path="/reset-password" element={<ResetPassword />} />
  {/* Diğer route'lar */}
</Routes>