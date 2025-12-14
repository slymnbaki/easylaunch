
export default function Footer() {
  return (
    <footer style={{marginTop:'3rem',padding:'2rem 1rem',background:'#fff',color:'#222',textAlign:'center',fontSize:15,borderTop:'2px solid #a855f7'}}>
      <div style={{marginBottom:8}}>
        <a href="/terms" style={{color:'#38bdf8',marginRight:16,textDecoration:'underline'}}>Terms</a>
        <a href="/privacy" style={{color:'#22d3ee',marginRight:16,textDecoration:'underline'}}>Privacy</a>
        <a href="/disclaimer" style={{color:'#a855f7',marginRight:16,textDecoration:'underline'}}>Disclaimer</a>
        <a href="mailto:info@easylaunch.app" style={{color:'#4ade80',marginRight:16,textDecoration:'underline'}}>İletişim</a>
        <a href="/kvkk" style={{color:'#facc15',marginRight:16,textDecoration:'underline'}}>KVKK/GDPR</a>
        <a href="https://twitter.com/easylaunch" target="_blank" rel="noopener noreferrer" style={{color:'#38bdf8',marginRight:16,textDecoration:'underline'}}>Twitter</a>
        <a href="https://linkedin.com/company/easylaunch" target="_blank" rel="noopener noreferrer" style={{color:'#22d3ee',textDecoration:'underline'}}>LinkedIn</a>
      </div>
      <div style={{marginTop:8,opacity:0.8}}>&copy; 2025 Easylaunch. Tüm hakları saklıdır.</div>
    </footer>
  );
}
