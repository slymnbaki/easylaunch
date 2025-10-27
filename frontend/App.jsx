import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ToastContainer, toast } from "react-toastify";
import AuthForm from "./AuthForm";
import TokenForm from "./TokenForm";
import WalletConnect from "./WalletConnect";
import Terms from "./Terms";
import Privacy from "./Privacy";
import MyTokens from "./MyTokens";
import TokenGallery from "./TokenGallery";
import "./i18n";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { t, i18n } = useTranslation();
  const [user, setUser] = useState(null);
  const [result, setResult] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [checked, setChecked] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("normal");

  const handleAuth = (username) => setUser(username);

  const handleCreate = async (formData) => {
    const response = await fetch("http://localhost:3001/api/create-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    setResult(data);
    if (response.ok) {
      toast.success("İşlem başarılı!");
    } else {
      toast.error("Bir hata oluştu!");
    }
  };

  const handleAddress = (addr) => setUserAddress(addr);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name, symbol, desc, userAddress, paymentMethod });
  };

  return (
    <Router>
      <div style={{ minHeight: "100vh", position: "relative", paddingBottom: 180 }}>
        {!userAddress && <WalletConnect onAddress={handleAddress} />}
        {userAddress && (
          <TokenForm
            userAddress={userAddress}
            onCreate={handleCreate}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        )}
        {result && (
          <div style={{ marginTop: 20 }}>
            <b>{result.message}</b>
            {result.tokenAddress && (
              <div>
                Token Adresi:{" "}
                <a
                  href={`https://sepolia.etherscan.io/address/${result.tokenAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.tokenAddress}
                </a>
              </div>
            )}
          </div>
        )}
        <AuthForm onAuth={handleAuth} />
        {user && <div>Hoşgeldin, {user}!</div>}
        {user && <MyTokens username={user} />}
        <input
          type="checkbox"
          required
          checked={checked}
          onChange={e => setChecked(e.target.checked)}
        />
        <label>
          <a href="/terms" target="_blank" rel="noopener noreferrer">Kullanım Şartları</a> ve
          <a href="/privacy" target="_blank" rel="noopener noreferrer">Gizlilik Politikası</a>’nı okudum, kabul ediyorum.
        </label>
        <button
          style={{
            background: "#1976d2",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "6px",
            border: "none",
            margin: "16px 0",
            fontWeight: "bold",
            cursor: "pointer"
          }}
          onClick={() => window.open("https://elt-token.com/buy", "_blank")}
        >
          ELT Al
        </button>

        {/* YASAL METİNLER */}
        <footer
          style={{
            background: "#f8f8f8",
            borderTop: "1px solid #ddd",
            padding: 24,
            fontSize: 13,
            color: "#444",
            position: "fixed", // absolute yerine fixed
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <div style={{ maxWidth: 800, margin: "auto" }}>
            <b>Kullanım Şartları & Gizlilik Politikası</b>
            <p>
              Easylaunch platformunu kullanarak, <b>Kullanım Şartları</b> ve <b>Gizlilik Politikası</b>’nı okuduğunuzu ve kabul ettiğinizi beyan etmiş olursunuz.
              Kişisel verileriniz KVKK ve GDPR kapsamında korunur. Bilgileriniz üçüncü kişilerle paylaşılmaz.
            </p>
            <b>Risk Uyarısı</b>
            <p>
              Bu platformda oluşturulan tokenler yatırım tavsiyesi değildir. Kripto varlıklar yüksek risk içerir ve tüm sorumluluk kullanıcıya aittir.
              Easylaunch, kullanıcıların oluşturduğu tokenlerden ve işlemlerden doğacak zararlardan sorumlu değildir.
            </p>
            <b>Yasal Sorumluluk</b>
            <p>
              Kullanıcılar, yürürlükteki tüm yasalara ve düzenlemelere uymakla yükümlüdür. Platformu kullanarak bu şartları kabul etmiş sayılırsınız.
            </p>
            <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
              © {new Date().getFullYear()} Easylaunch. Tüm hakları saklıdır.
            </div>
          </div>
        </footer>
      </div>
      <Routes>
        <Route path="/" element={
          <div style={{ minHeight: "100vh", position: "relative", paddingBottom: 180 }}>
            {!userAddress && <WalletConnect onAddress={handleAddress} />}
            {userAddress && (
              <TokenForm
                userAddress={userAddress}
                onCreate={handleCreate}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            )}
            {result && (
              <div style={{ marginTop: 20 }}>
                <b>{result.message}</b>
                {result.tokenAddress && (
                  <div>
                    Token Adresi:{" "}
                    <a
                      href={`https://sepolia.etherscan.io/address/${result.tokenAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {result.tokenAddress}
                    </a>
                  </div>
                )}
              </div>
            )}
            <AuthForm onAuth={handleAuth} />
            {user && <div>Hoşgeldin, {user}!</div>}
            {user && <MyTokens username={user} />}
            <input
              type="checkbox"
              required
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
            />
            <label>
              <a href="/terms" target="_blank" rel="noopener noreferrer">Kullanım Şartları</a> ve
              <a href="/privacy" target="_blank" rel="noopener noreferrer">Gizlilik Politikası</a>’nı okudum, kabul ediyorum.
            </label>
            <button
              style={{
                background: "#1976d2",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: "6px",
                border: "none",
                margin: "16px 0",
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onClick={() => window.open("https://elt-token.com/buy", "_blank")}
            >
              ELT Al
            </button>
            <TokenGallery />
          </div>
        } />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;