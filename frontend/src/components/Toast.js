import React, { useEffect } from "react";

const Toast = ({ message, type = "info", onClose, duration = 3000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast toast-${type}`} style={{position:'fixed',bottom:24,right:24,zIndex:9999,padding:'1rem 2rem',borderRadius:8,background:type==='error'?'#ffdddd':type==='success'?'#ddffdd':'#eee',color:'#333',boxShadow:'0 2px 8px rgba(0,0,0,0.15)'}}>
      {message}
      <button style={{marginLeft:16}} onClick={onClose}>Kapat</button>
    </div>
  );
};

export default Toast;
