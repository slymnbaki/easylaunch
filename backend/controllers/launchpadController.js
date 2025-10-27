const Launchpad = require("../models/Launchpad");
const { ethers } = require("ethers");
const TokenArtifact = require("../../artifacts/contracts/Token.sol/Token.json");
const Purchase = require("../models/Purchase");

exports.createLaunchpad = async (req, res) => {
  try {
    const launchpad = await Launchpad.create(req.body);
    res.json(launchpad);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listLaunchpads = async (req, res) => {
  try {
    const launchpads = await Launchpad.find().sort({ createdAt: -1 });
    res.json(launchpads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.buyToken = async (req, res) => {
  const { launchpadId, amount, buyer } = req.body;
  const launchpad = await Launchpad.findById(launchpadId);
  if (!launchpad) return res.status(404).json({ error: "Launchpad bulunamadı" });

  try {
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const token = new ethers.Contract(launchpad.tokenAddress, TokenArtifact.abi, wallet);

    const tx = await token.transfer(buyer, amount);
    await tx.wait();

    // Satın alma kaydını ekle
    await Purchase.create({
      launchpadId,
      buyer,
      amount,
      txHash: tx.hash,
    });

    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.userPurchases = async (req, res) => {
  const { buyer } = req.params;
  const purchases = await Purchase.find({ buyer }).sort({ createdAt: -1 });
  res.json(purchases);
};