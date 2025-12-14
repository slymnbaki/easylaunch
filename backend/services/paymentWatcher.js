// Blockchain ödeme izleme servisi örneği
const { ethers } = require('ethers');
const Payment = require('../models/Payment');

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL || 'https://rpc.sepolia.org');

async function watchPayment(txHash) {
  try {
    const receipt = await provider.waitForTransaction(txHash, 1, 60000); // 1 onay, 60sn timeout
    if (receipt && receipt.status === 1) {
      await Payment.findOneAndUpdate({ txHash }, { status: 'confirmed', confirmedAt: new Date() });
      console.log('Ödeme onaylandı:', txHash);
      return true;
    } else {
      await Payment.findOneAndUpdate({ txHash }, { status: 'failed' });
      console.log('Ödeme başarısız:', txHash);
      return false;
    }
  } catch (err) {
    console.error('Ödeme izleme hatası:', err);
    return false;
  }
}

module.exports = { watchPayment };
