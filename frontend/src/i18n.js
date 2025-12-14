import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to Easylaunch!',
      kyc: 'KYC Application',
      submit: 'Submit',
      email: 'Email',
      name: 'Name Surname',
      idNumber: 'ID Number',
      sent: 'Application sent!'
    }
  },
  tr: {
    translation: {
      welcome: 'Easylaunch’a Hoşgeldiniz!',
      kyc: 'KYC Başvuru',
      submit: 'Gönder',
      email: 'Email',
      name: 'Ad Soyad',
      idNumber: 'Kimlik No',
      sent: 'Başvuru alındı!'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'tr',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
