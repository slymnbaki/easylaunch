import { render, screen, fireEvent } from "@testing-library/react";
import AuthForm from "../AuthForm";

test("renders AuthForm and submits login", () => {
  const handleAuth = jest.fn();
  render(<AuthForm onAuth={handleAuth} />);
  fireEvent.change(screen.getByLabelText(/Kullanıcı Adı/i), { target: { value: "testuser" } });
  fireEvent.change(screen.getByLabelText(/Şifre/i), { target: { value: "123456" } });
  fireEvent.click(screen.getByText(/Giriş Yap/i));
  // Burada API çağrısı mocklanabilir, handleAuth fonksiyonunun çağrıldığını kontrol edebilirsin.
});