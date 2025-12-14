
import TokenDetail from './TokenDetail';

export default function TokenGallery() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);

  useEffect(() => {
    fetch('/api/tokens')
      .then(res => res.json())
      .then(data => {
        setTokens(Array.isArray(data) ? data : data.tokens || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Veri alınamadı: ' + err.message);
        setLoading(false);
      });
  }, []);

  if (selectedToken) {
    return <TokenDetail token={selectedToken} />;
  }

  return (
    <section style={{padding:'2rem 0',textAlign:'center',background:'var(--bg-main)',minHeight:'60vh'}}>
      <h2 style={{color:'var(--accent-blue)',fontSize:'2.2rem',marginBottom:12}}>Tüm Tokenler</h2>
      {loading && <div style={{color:'var(--accent-blue)',fontSize:20,margin:'2rem'}}>Yükleniyor...</div>}
      {error && <div style={{color:'var(--danger)',fontSize:18,margin:'2rem'}}>{error}</div>}
      {!loading && !error && tokens.length === 0 && (
        <div style={{color:'var(--warning)',fontSize:18,margin:'2rem'}}>Henüz token yok.</div>
      )}
      {!loading && !error && tokens.length > 0 && (
        <div className="token-gallery-grid" style={{marginTop:24}}>
          {tokens.map(token => (
            <div key={token._id || token.address} className="token-card">
              <div style={{fontSize:20,fontWeight:'bold',color:theme.neonBlue,marginBottom:8}}>{token.name} <span style={{color:theme.textSecondary}}>[{token.symbol}]</span></div>
              <div style={{fontSize:15,color:theme.textSecondary,marginBottom:8}}>Arz: {token.supply}</div>
              <div style={{fontSize:14,color:theme.textSecondary,marginBottom:8}}>Ağ: {token.network}</div>
              <div style={{fontSize:14,color:theme.textSecondary,marginBottom:8}}>Sahip: {token.owner}</div>
              <a href={`https://sepolia.etherscan.io/address/${token.address}`} target="_blank" rel="noopener noreferrer" style={{color:theme.neonCyan,fontSize:13,marginBottom:8}}>Explorer</a>
              <button onClick={()=>setSelectedToken(token)} style={{marginTop:8,padding:'8px 18px',borderRadius:8,background:theme.buttonGradient,color:'#fff',border:'none',fontWeight:'bold',boxShadow:theme.buttonGlow}}>Detay</button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
