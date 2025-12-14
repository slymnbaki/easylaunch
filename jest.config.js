module.exports = {
  moduleDirectories: ['node_modules', 'src'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testPathIgnorePatterns: [
    "/node_modules/",
    "/contracts/",
    "/hardhat/",
    "/frontend/",
    "/test/" // Hardhat tests are run with npx hardhat test
  ]
};