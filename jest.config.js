module.exports = {
  testPathIgnorePatterns: [
    "/node_modules/",
    "/contracts/",
    "/hardhat/",
    "/frontend/",
    "/test/" // Hardhat tests are run with npx hardhat test
  ]
};