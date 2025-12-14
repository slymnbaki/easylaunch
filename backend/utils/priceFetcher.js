// utils/priceFetcher.js
// Ağ tokeni ve ELT fiyatlarını CoinGecko API üzerinden çeker

const axios = require('axios');

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';

// Ağ adı -> CoinGecko id eşlemesi
const networkToId = {
  sepolia: 'ethereum',
  mainnet: 'ethereum',
  holesky: 'ethereum',
  bsc: 'binancecoin',
  polygon: 'matic-network',
  avalanche: 'avalanche-2',
  fantom: 'fantom',
  arbitrum: 'arbitrum',
  optimism: 'optimism',
  zksync: 'ethereum', // ZkSync için ETH kullanılır
  elt: 'eltcoin' // ELT için örnek id, gerçek id ile değiştirilmeli
};

async function getTokenPrice(network, vsCurrency = 'usd') {
  const id = networkToId[network.toLowerCase()];
  if (!id) throw new Error('Desteklenmeyen ağ veya token');
  const url = `${COINGECKO_API}?ids=${id}&vs_currencies=${vsCurrency}`;
  const res = await axios.get(url);
  if (!res.data[id] || !res.data[id][vsCurrency]) throw new Error('Fiyat bulunamadı');
  return res.data[id][vsCurrency];
}

module.exports = { getTokenPrice };
