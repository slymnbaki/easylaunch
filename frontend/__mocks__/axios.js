const mockGet = (url) => {
  if (typeof url === "string" && url.includes("/balance")) {
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
};

module.exports = {
  get: jest.fn((url) => mockGet(url)),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
};