// Swap Controller

const Token = require('../models/Token');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Swap = require('../models/Swap');
const { performSwap } = require('../services/swapService');

/**
 * Swap tokens between users or with native token (gerçek zincir üstü swap)
 * @param {*} req
 * @param {*} res
 */
exports.swapTokens = async (req, res) => {
  try {
    const { fromUserId, toUserId, fromToken, toToken, fromAmount, toAmount, network, fromAddress, toAddress, privateKey } = req.body;
    if (!fromUserId || !toUserId || !fromToken || !toToken || !fromAmount || !toAmount || !network || !fromAddress || !toAddress || !privateKey) {
      return res.status(400).json({ error: 'Eksik parametre' });
    }

    // Swap işlemini zincir üzerinde gerçekleştir
    let txHash = null;
    let status = 'pending';
    try {
      const networkRpc = process.env[`RPC_URL_${network.toUpperCase()}`] || process.env.RPC_URL;
      const swapResult = await performSwap({ fromAddress, toAddress, fromToken, toToken, fromAmount, toAmount, networkRpc, privateKey });
      txHash = swapResult.txHash;
      status = swapResult.status;
    } catch (swapErr) {
      status = 'failed';
      return res.status(500).json({ error: 'Swap zincir üstü başarısız', details: swapErr.message });
    }

    // Swap kaydını DB'ye yaz
    const swap = new Swap({
      fromUser: fromUserId,
      toUser: toUserId,
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      network,
      status,
      txHash
    });
    await swap.save();

    return res.json({ success: true, message: 'Swap işlemi zincir üstünde tamamlandı.', swap });
  } catch (err) {
    return res.status(500).json({ error: 'Swap işlemi sırasında hata oluştu.', details: err.message });
  }
};
