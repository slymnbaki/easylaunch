
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import theme from '../theme';
import { ethers } from 'ethers';

// Ağ seçenekleri (örnek)
const networks = [
  { name: 'sepolia', label: 'Sepolia Testnet' },
  { name: 'holesky', label: 'Holesky Testnet' },
  { name: 'mainnet', label: 'Ethereum Mainnet' },
  { name: 'bsc-testnet', label: 'BSC Testnet' },
  { name: 'bsc', label: 'BSC Mainnet' },
  { name: 'polygon-mumbai', label: 'Polygon Mumbai' },
  { name: 'polygon', label: 'Polygon Mainnet' },
  { name: 'avalanche-fuji', label: 'Avalanche Fuji' },
  { name: 'avalanche', label: 'Avalanche Mainnet' },
];
export default function TokenWizard() {
    const [step, setStep] = useState(2); // Tek sayfa için varsayılan adım
  const [paymentMethod, setPaymentMethod] = useState('elt');
  const [paymentNetwork, setPaymentNetwork] = useState(networks[0].name);
  const [txHash, setTxHash] = useState('');
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [price, setPrice] = useState(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [network, setNetwork] = useState(networks[0].name);
  const [form, setForm] = useState({
    name: '',
    symbol: '',
    supply: '',
    mintable: false,
    burnable: false,
    pausable: false
  });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [result, setResult] = useState('');
  const [contractAddress, setContractAddress] = useState("");

  // Fiyatı güncelle
  React.useEffect(() => {
    async function fetchPrice() {
      setPriceLoading(true);
      setPrice(null);
      let net = paymentMethod === 'elt' ? 'elt' : paymentNetwork;
      try {
        const res = await fetch(`/api/payment/price/fetch?network=${net}&currency=usd`);
        const data = await res.json();
        if (data.success) setPrice(data.price);
        else setPrice(null);
      } catch {
        setPrice(null);
      }
      setPriceLoading(false);
    }
    fetchPrice();
  }, [paymentMethod, paymentNetwork]);

  // Tek sayfa form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!window.ethereum) {
        toast.error('Cüzdan eklentisi (MetaMask) bulunamadı!');
        setLoading(false);
        return;
      }
      // Bağlan
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      setWalletAddress(accounts[0]);
      // Platform cüzdan adresi (backend .env'den alınmalı, burada sabit örnek)
      const platformWallet = '0x4a251FF2817e14e7c1FFA7B801bD152BB38574D8';
      // Fiyatı token cinsine çevir
      let value;
      if (paymentMethod === 'elt') {
        value = ethers.parseUnits('1', 18);
      } else {
        value = ethers.parseUnits((1 / price).toFixed(6), 18);
      }
      // Transfer başlat
      const tx = await signer.sendTransaction({
        to: platformWallet,
        value: value
      });
      setTxHash(tx.hash);
      setAmount(ethers.formatUnits(value, 18));
      // Backend'e ödeme kaydı gönder
      const paymentRes = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          txHash: tx.hash,
          paymentMethod,
          paymentNetwork: paymentMethod==='elt' ? 'elt' : paymentNetwork,
          userEmail: email,
          amount: ethers.formatUnits(value, 18),
          packageType: 'basic'
        })
      });
      const paymentData = await paymentRes.json();
      if (!(paymentData.success && paymentData.paymentId)) {
        toast.error('Ödeme kaydedilemedi: ' + (paymentData.error || 'Bilinmeyen hata'));
        setLoading(false);
        return;
      }
      setPaymentId(paymentData.paymentId);
      // Token oluştur
      const tokenRes = await fetch('/api/tokens/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          symbol: form.symbol,
          initialSupply: form.supply,
          canMint: form.mintable,
          canBurn: form.burnable,
          canPause: form.pausable,
          network,
          email: email,
          paymentId: paymentData.paymentId,
          paymentMethod: paymentMethod,
          paymentNetwork: paymentNetwork,
          txHash: tx.hash,
          amount: ethers.formatUnits(value, 18)
        })
      });
      const text = await tokenRes.text();
      let data;
      try { data = JSON.parse(text); } catch (e) { data = { success: false, error: text }; }
      if (data.success && data.contractAddress) {
        setContractAddress(data.contractAddress);
        setResult('Token başarıyla oluşturuldu!');
        toast.success('Token başarıyla oluşturuldu!');
      } else {
        setResult('Token oluşturulamadı: ' + (data.error || 'Bilinmeyen hata'));
        toast.error('Token oluşturulamadı: ' + (data.error || 'Bilinmeyen hata'));
      }
    } catch (err) {
      toast.error('İşlem başarısız: ' + (err.message || err));
    }
    setLoading(false);
  };

  return (
  
    <div style={{maxWidth:600,margin:'0 auto',padding:24,background:theme.card,borderRadius:16,boxShadow:theme.borderGlow}}>
      <h2 style={{color:theme.neonBlue,marginBottom:24}}>Token Oluştur & Ödeme</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Token Adı" required style={{marginBottom:8,width:'100%',padding:8}} />
        <input type="text" value={form.symbol} onChange={e=>setForm({...form, symbol:e.target.value})} placeholder="Token Sembolü" required style={{marginBottom:8,width:'100%',padding:8}} />
        <input type="number" value={form.supply} onChange={e=>setForm({...form, supply:e.target.value})} placeholder="Başlangıç Arzı" required style={{marginBottom:8,width:'100%',padding:8}} />
        <div style={{display:'flex',gap:12,marginBottom:8}}>
          <label style={{color:'#fff',background:'#222',padding:'2px 8px',borderRadius:4}}><input type="checkbox" checked={form.mintable} onChange={e=>setForm({...form, mintable:e.target.checked})}/> Mint Edilebilir</label>
          <label style={{color:'#fff',background:'#222',padding:'2px 8px',borderRadius:4}}><input type="checkbox" checked={form.burnable} onChange={e=>setForm({...form, burnable:e.target.checked})}/> Yakılabilir</label>
          <label style={{color:'#fff',background:'#222',padding:'2px 8px',borderRadius:4}}><input type="checkbox" checked={form.pausable} onChange={e=>setForm({...form, pausable:e.target.checked})}/> Duraklatılabilir</label>
        </div>
        <select value={network} onChange={e=>setNetwork(e.target.value)} style={{marginBottom:8,width:'100%',padding:8}}>
          {networks.map(n=>(<option key={n.name} value={n.name}>{n.label}</option>))}
        </select>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-posta" required style={{marginBottom:8,width:'100%',padding:8}} />
        <div style={{marginBottom:8}}>
          <label style={{color:'#fff',background:'#222',padding:'2px 8px',borderRadius:4}}><input type="radio" checked={paymentMethod==='elt'} onChange={()=>setPaymentMethod('elt')} /> ELT ile Öde</label>
          <label style={{color:'#fff',background:'#222',padding:'2px 8px',borderRadius:4,marginLeft:16}}><input type="radio" checked={paymentMethod!=='elt'} onChange={()=>setPaymentMethod('other')} /> Diğer Ağ Tokenı ile Öde</label>
        </div>
        {paymentMethod!=='elt' && (
          <select value={paymentNetwork} onChange={e=>setPaymentNetwork(e.target.value)} style={{marginBottom:8,width:'100%',padding:8}}>
            {networks.filter(n=>n.name!=='elt').map(n=>(<option key={n.name} value={n.name}>{n.label}</option>))}
          </select>
        )}
        <button type="submit" disabled={loading} style={{padding:'10px 32px',borderRadius:8,background:theme.success,color:'#fff',border:'none',fontWeight:'bold',boxShadow:theme.buttonGlow,marginTop:8}}>
          {loading ? 'Oluşturuluyor...' : 'Onayla ve Oluştur'}
        </button>
      </form>
      {result && (
        <div style={{marginTop:16,color:result.startsWith('Token başarıyla')?theme.success:theme.error,fontWeight:'bold'}}>{result}</div>
      )}
      {contractAddress && (
        <div style={{marginTop:18,color:theme.neonCyan,fontWeight:'bold',fontSize:16}}>
          Sözleşme Adresi: <a href={`https://sepolia.etherscan.io/address/${contractAddress}`} target="_blank" rel="noopener noreferrer">{contractAddress}</a>
        </div>
      )}
    </div>
  );
}
