import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import AppRouter from './AppRouter';

test('Ana başlık render ediliyor', () => {
  render(<App />);
  const titleElement = screen.getByText(/Easylaunch/i);
  expect(titleElement).toBeInTheDocument();
});

test('Footer ve legal linkler render ediliyor', () => {
  render(<App />);
  expect(screen.getByText(/Terms/i)).toBeInTheDocument();
  expect(screen.getByText(/Privacy/i)).toBeInTheDocument();
  expect(screen.getByText(/© 2025 Easylaunch/i)).toBeInTheDocument();
});

test('Token oluşturma formu render ediliyor', () => {
  render(<App />);
  expect(screen.getByText(/Token Oluştur/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Token Adı/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Sembol/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Arz/i)).toBeInTheDocument();
});

test('Loader bileşeni fallback olarak render ediliyor', () => {
  // Suspense fallback test
  // Loader bileşeni "Yükleniyor..." metni ile render edilmeli
  render(<App />);
  expect(screen.getByText(/Yükleniyor.../i)).toBeInTheDocument();
});

test('Navbar ve footer render ediliyor', () => {
  render(<AppRouter />);
  expect(screen.getByText(/Easylaunch/i)).toBeInTheDocument();
  expect(screen.getByText(/Yükleniyor.../i)).toBeInTheDocument();
});

test('Home page ve i18n çalışıyor', () => {
  render(<AppRouter />);
  expect(screen.getByText(/Hoşgeldiniz|Welcome/i)).toBeInTheDocument();
});
