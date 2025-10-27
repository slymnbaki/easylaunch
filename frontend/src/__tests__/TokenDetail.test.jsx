jest.mock("axios");
const axios = require("axios");
const React = require("react");
const { render, screen } = require("@testing-library/react");
const TokenDetail = require("../../src/TokenDetail").default;

// ensure mock axios is permissive
axios.get = jest.fn((url) => {
  if (typeof url === "string" && url.includes("/balance/")) {
    return Promise.resolve({ data: { balance: "5000" } });
  }
  if (typeof url === "string" && url.includes("/transfers")) {
    return Promise.resolve({
      data: [
        { _id: "1", amount: 100, to: "0xabc", txHash: "0xtxhash1", createdAt: new Date().toISOString() }
      ]
    });
  }
  return Promise.resolve({ data: {} });
});

const mockTransfers = [
  { _id: "1", amount: 100, to: "0xabc", txHash: "0xtxhash1", createdAt: new Date().toISOString() }
];

test("TokenDetail renders token info and transfer list", async () => {
  const mockToken = {
    address: "0x1",
    name: "TestToken",
    symbol: "TTK",
    totalSupply: "1000",
    balance: "5000",
    transfers: mockTransfers  // deterministik fallback
  };
  render(React.createElement(TokenDetail, { token: mockToken }));
  expect(screen.getByText(/TestToken/i)).toBeInTheDocument();
  expect(screen.getByText(/Symbol:/i)).toBeInTheDocument();
  expect(screen.getByText(/Total supply:/i)).toBeInTheDocument();
  expect(await screen.findByText(/Balance:\s*5000/i)).toBeInTheDocument();
  expect(await screen.findByText(/0xabc/)).toBeInTheDocument();
});