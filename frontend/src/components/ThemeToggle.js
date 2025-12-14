import React from "react";

const ThemeToggle = ({ theme, setTheme }) => {
  return (
    <button
      style={{position:'fixed',top:24,right:24,zIndex:9999,padding:'0.5rem 1rem',borderRadius:8,background:'#eee',color:'#333',border:'none',boxShadow:'0 2px 8px rgba(0,0,0,0.10)'}}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'light' ? '🌙 Karanlık Mod' : '☀️ Aydınlık Mod'}
    </button>
  );
};

export default ThemeToggle;
