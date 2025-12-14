
import React, { Suspense, useState } from 'react';
import GlobalLoader from './components/GlobalLoader';
import Toast from './components/Toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';


import Home from './pages/Home';
import TokenCreate from './pages/TokenCreate';
import Dashboard from './pages/Dashboard';
import Launchpad from './pages/Launchpad';
import Admin from './pages/Admin';
import TokenGallery from './pages/TokenGallery';
import UserPanel from './pages/UserPanel';
import Swap from './pages/Swap';
const Kyc = React.lazy(() => import('./pages/Kyc'));
const NftMint = React.lazy(() => import('./pages/NftMint'));
const Kvkk = React.lazy(() => import('./pages/Kvkk'));
const Aydinlatma = React.lazy(() => import('./pages/Aydinlatma'));

// Generic static HTML loader for privacy, disclaimer, terms
function StaticHtmlPage({ file }) {
  const [html, setHtml] = React.useState('');
  React.useEffect(() => {
    fetch(file)
      .then(res => res.text())
      .then(setHtml);
  }, [file]);
  return <div style={{background:'#fff',minHeight:'60vh',maxWidth:800,margin:'2rem auto',borderRadius:12,padding:32,boxShadow:'0 2px 16px #0001'}} dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function AppRouter() {
  const [walletAddress, setWalletAddress] = useState(() => localStorage.getItem("walletAddress") || "");
  const [network, setNetwork] = useState("");
  const [globalLoading, setGlobalLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  React.useEffect(() => {
    const gradient = 'linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)';
    document.body.style.background = gradient;
    document.body.style.color = '#222';
    document.documentElement.style.background = gradient;
    document.documentElement.style.color = '#222';
  }, []);

  const onConnect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        localStorage.setItem("walletAddress", accounts[0]);
        const netId = await window.ethereum.request({ method: 'net_version' });
        setNetwork(netId);
      } catch (err) {
        alert('Cüzdan bağlantısı reddedildi!');
      }
    } else {
      alert('MetaMask veya uyumlu bir cüzdan eklentisi bulunamadı!');
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #38bdf8 0%, #a855f7 100%)',
      minHeight: '100vh',
      color: '#222',
    }}>
      <Router>
        <Navbar walletAddress={walletAddress} onConnect={onConnect} network={network} />
        <GlobalLoader loading={globalLoading} />
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
        <Suspense fallback={<div style={{textAlign:'center',margin:'2rem',color:'#222'}}>Yükleniyor...</div>}>
          <Routes>
            <Route path="/" element={<Home setGlobalLoading={setGlobalLoading} setToast={setToast} />} />
            <Route path="/token-create" element={<TokenCreate setGlobalLoading={setGlobalLoading} setToast={setToast} />} />
            <Route path="/dashboard" element={<Dashboard setGlobalLoading={setGlobalLoading} setToast={setToast} />} />
            <Route path="/launchpad" element={<Launchpad setGlobalLoading={setGlobalLoading} setToast={setToast} />} />
            <Route path="/admin" element={<Admin setGlobalLoading={setGlobalLoading} setToast={setToast} />} />
            <Route path="/tokens" element={<TokenGallery setGlobalLoading={setGlobalLoading} setToast={setToast} />} />
            <Route path="/user" element={<UserPanel setGlobalLoading={setGlobalLoading} setToast={setToast} />} />
            <Route path="/swap" element={<Swap setGlobalLoading={setGlobalLoading} setToast={setToast} />} />
            <Route path="/kyc" element={<Kyc setGlobalLoading={setGlobalLoading} setToast={setToast} />} />
            <Route path="/nft-mint" element={<NftMint setGlobalLoading={setGlobalLoading} setToast={setToast} />} />

            {/* Legal/Disclosure Pages */}
            <Route path="/kvkk" element={<Kvkk />} />
            <Route path="/aydinlatma" element={<Aydinlatma />} />
            <Route path="/privacy" element={<StaticHtmlPage file="/privacy.html" />} />
            <Route path="/disclaimer" element={<StaticHtmlPage file="/disclaimer.html" />} />
            <Route path="/terms" element={<StaticHtmlPage file="/terms.html" />} />
          </Routes>
        </Suspense>
        <Footer />
      </Router>
    </div>
  );
}
