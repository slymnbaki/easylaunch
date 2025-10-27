import { render, screen } from "@testing-library/react";
import TokenGallery from "../TokenGallery";

test("renders TokenGallery and shows header", () => {
  render(<TokenGallery />);
  expect(screen.getByText(/Tüm Tokenler/i)).toBeInTheDocument();
});