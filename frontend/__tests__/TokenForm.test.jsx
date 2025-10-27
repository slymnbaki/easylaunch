import { render, screen, fireEvent } from "@testing-library/react";
import TokenForm from "../TokenForm";

test("renders TokenForm and submits", () => {
  const handleCreate = jest.fn();
  render(<TokenForm userAddress="0x123" onCreate={handleCreate} paymentMethod="normal" setPaymentMethod={() => {}} />);
  fireEvent.change(screen.getByPlaceholderText("Token adı"), { target: { value: "Test" } });
  fireEvent.change(screen.getByPlaceholderText("Token sembolü"), { target: { value: "TTK" } });
  fireEvent.click(screen.getByText("Token Oluştur"));
  expect(handleCreate).toHaveBeenCalled();
});