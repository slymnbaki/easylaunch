// Basit ve yeniden kullanılabilir input validasyon fonksiyonları
export const validateEmail = (email) => {
  if (!email) return "Email zorunlu";
  const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!re.test(email)) return "Geçersiz email formatı";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Şifre zorunlu";
  if (password.length < 6) return "Şifre en az 6 karakter olmalı";
  return "";
};

export const validateRequired = (value, fieldName = "Alan") => {
  if (!value) return `${fieldName} zorunlu`;
  return "";
};

export const validateNumber = (value, fieldName = "Sayı") => {
  if (value === undefined || value === "") return `${fieldName} zorunlu`;
  if (isNaN(value)) return `${fieldName} geçerli bir sayı olmalı`;
  return "";
};

// Diğer validasyonlar eklenebilir
