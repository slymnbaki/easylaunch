import React from "react";

const GlobalLoader = ({ loading }) => {
  if (!loading) return null;
  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(255,255,255,0.7)',zIndex:9998,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{padding:32,background:'#fff',borderRadius:16,boxShadow:'0 2px 16px rgba(0,0,0,0.15)'}}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{animation:'spin 1s linear infinite'}}>
          <circle cx="24" cy="24" r="20" stroke="#1976d2" strokeWidth="4" strokeDasharray="100" strokeDashoffset="60" />
        </svg>
        <div style={{marginTop:16,fontSize:18,color:'#1976d2'}}>Yükleniyor...</div>
      </div>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default GlobalLoader;
