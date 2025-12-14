import CookieNotice from './components/CookieNotice';
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './i18n';
import './App.css';
// import { themes } from './themes';
import { useTranslation } from 'react-i18next';

// Bu dosya artık sadece fallback veya özel sayfa için kullanılabilir.
export default function App() {
  const { t, i18n } = useTranslation();
  // Theme logic removed, always use light theme
  const currentTheme = { background: '#fff', text: '#222' };
  return (
    <div className="container" style={{textAlign:'center',margin:'4rem auto',background:currentTheme.background,color:currentTheme.text}}>
      <div style={{marginBottom:16}}>
        <button onClick={()=>i18n.changeLanguage('tr')}>TR</button>
        <button onClick={()=>i18n.changeLanguage('en')} style={{marginLeft:8}}>EN</button>
      </div>
      <h2>{t('welcome')}</h2>
      <p>Yönlendirme ve ana layout AppRouter ile yönetiliyor.</p>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <CookieNotice />
    </div>
  );
}
