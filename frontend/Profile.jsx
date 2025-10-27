import React from "react";
export default function Profile({ onLogout }) {
  return (
    <button
      onClick={() => {
        localStorage.removeItem("token");
        onLogout();
      }}
    >
      Çıkış Yap
    </button>
  );
}