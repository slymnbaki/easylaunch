const { getTokenPrice } = require('../utils/priceFetcher');
// GET /api/payment/price?network=xxx&currency=usd
exports.getPrice = async (req, res) => {
  try {
    const { network, currency } = req.query;
    if (!network) return res.status(400).json({ success: false, error: 'Ağ veya token belirtilmeli' });
    const price = await getTokenPrice(network, currency || 'usd');
    res.json({ success: true, price });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
const Payment = require('../models/Payment');
const { watchPayment } = require('../services/paymentWatcher');

exports.createPayment = async (req, res) => {
  try {
    const { txHash, paymentMethod, paymentNetwork, userEmail, amount, packageType, tokenAddress } = req.body;
    if (!txHash || !paymentMethod || !paymentNetwork || !userEmail || !amount) {
      return res.status(400).json({ success: false, error: 'Eksik parametre' });
    }
    const payment = new Payment({
      txHash,
      paymentMethod,
      paymentNetwork,
      userEmail,
      amount,
      packageType,
      tokenAddress,
      status: 'pending'
    });
    await payment.save();
    // Blockchain izleme servisini tetikle
    watchPayment(txHash);
    res.json({ success: true, paymentId: payment._id });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Ödeme oluşturulamadı', message: err.message });
  }
};

exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, error: 'Ödeme bulunamadı' });
    res.json({ success: true, payment });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Ödeme sorgulanamadı', message: err.message });
  }
};
