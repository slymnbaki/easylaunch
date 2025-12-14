import React from 'react';
export default function GoogleLoginButton() {
  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };
  return <button onClick={handleLogin} style={{background:'#fff',color:'#222',padding:'8px 16px',borderRadius:6,border:'1px solid #ccc'}}>Google ile Giriş</button>;
}
