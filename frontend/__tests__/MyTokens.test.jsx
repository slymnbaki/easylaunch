import { render, screen } from "@testing-library/react";
import MyTokens from "../MyTokens";

test("renders MyTokens and shows empty message", () => {
  render(<MyTokens username="testuser" />);
  expect(screen.getByText(/Henüz tokeniniz yok/i)).toBeInTheDocument();
});