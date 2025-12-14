import React, { useState } from 'react';
export default function CookieNotice() {
  const [show, setShow] = useState(!localStorage.getItem('cookie_accepted'));
  if (!show) return null;
  return (
    <div style={{position:'fixed',bottom:0,left:0,right:0,background:'#222',color:'#fff',padding:16,zIndex:1000}}>
      Bu site çerezleri ve kişisel verileri KVKK/GDPR kapsamında işler. <button onClick={()=>{localStorage.setItem('cookie_accepted',1);setShow(false);}} style={{marginLeft:16}}>Kabul Et</button>
    </div>
  );
}
