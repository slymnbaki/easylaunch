// Basit çoklu dil desteği
import React, { createContext, useContext, useState } from "react";

const translations = {
  tr: {
    welcome: "Hoşgeldiniz",
    login: "Giriş Yap",
    logout: "Çıkış Yap",
    loading: "Yükleniyor...",
    error: "Hata oluştu!"
  },
  en: {
    welcome: "Welcome",
    login: "Login",
    logout: "Logout",
    loading: "Loading...",
    error: "An error occurred!"
  }
};

const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState("tr");
  const t = (key) => translations[lang][key] || key;
  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
