import { render, screen } from "@testing-library/react";
import AdminPanel from "../AdminPanel";

test("renders AdminPanel and shows admin header", () => {
  render(<AdminPanel />);
  expect(screen.getByText(/Admin Panel/i)).toBeInTheDocument();
});