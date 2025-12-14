
// paymentChecker.js
// Ethers.js ile bir adresin bakiyesini ve Etherscan API ile gelen ödemeleri kontrol eden kod

const { ethers } = require("ethers");
const axios = require("axios");
require("dotenv").config();

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const platformWallet = process.env.REACT_APP_PLATFORM_WALLET || "0x4a251FF2817e14e7c1FFA7B801bD152BB38574D8";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "YOUR_ETHERSCAN_API_KEY";

async function getBalance(address) {
  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance);
}

async function getLastTransactions(address, count = 10) {
  // Etherscan API ile son transferleri çek
  const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
  try {
    const response = await axios.get(url);
    if (response.data.status === "1" && response.data.result) {
      // Son gelen transferleri filtrele
      const incomingTxs = response.data.result.filter(tx => tx.to.toLowerCase() === address.toLowerCase());
      return incomingTxs.slice(0, count);
    }
    return [];
  } catch (err) {
    console.error("Etherscan API hatası:", err.message);
    return [];
  }
}

// Kullanım örneği
(async () => {
  console.log("Platform cüzdan adresi:", platformWallet);
  const balance = await getBalance(platformWallet);
  console.log("Bakiyesi:", balance, "ETH");
  const txs = await getLastTransactions(platformWallet, 5);
  console.log("Son gelen transferler:", txs);
})();

module.exports = { getBalance, getLastTransactions };
