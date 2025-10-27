const { ethers } = require("ethers");
const axios = require("axios");
const TokenArtifact = require("../../artifacts/contracts/Token.sol/Token.json");
const Token = require("../models/Token");

exports.deployToken = async (req, res) => {
  const { captcha, name, symbol, initialSupply, canMint, canPause, canBurn, network, email } = req.body;

  // reCAPTCHA doğrulaması
  const secret = process.env.RECAPTCHA_SECRET;
  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captcha}`;
  try {
    const response = await axios.post(verifyUrl);
    if (!response.data.success) {
      return res.status(400).json({ error: "reCAPTCHA doğrulaması başarısız!" });
    }
  } catch (err) {
    return res.status(500).json({ error: "reCAPTCHA doğrulama hatası!" });
  }

  const networks = {
    sepolia: {
      rpc: process.env.SEPOLIA_RPC_URL,
      key: process.env.PRIVATE_KEY,
    },
    bscTestnet: {
      rpc: process.env.BSC_TESTNET_RPC_URL,
      key: process.env.BSC_PRIVATE_KEY,
    },
    polygonMumbai: {
      rpc: process.env.POLYGON_MUMBAI_RPC_URL,
      key: process.env.POLYGON_PRIVATE_KEY,
    },
  };

  const net = networks[network];
  if (!net || !net.rpc || !net.key) return res.status(400).json({ error: "Geçersiz ağ seçimi veya eksik anahtar" });

  try {
    const provider = new ethers.JsonRpcProvider(net.rpc);
    const wallet = new ethers.Wallet(net.key, provider);

    const factory = new ethers.ContractFactory(TokenArtifact.abi, TokenArtifact.bytecode, wallet);

    const contract = await factory.deploy(
      name,
      symbol,
      initialSupply,
      canMint,
      canPause,
      canBurn
    );
    await contract.waitForDeployment();

    await Token.create({
      name,
      symbol,
      initialSupply,
      canMint,
      canPause,
      canBurn,
      network,
      address: contract.target,
    });

    res.json({ address: contract.target });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listTokens = async (req, res) => {
  try {
    const tokens = await Token.find().sort({ createdAt: -1 });
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.userTokens = async (req, res) => {
  const userId = req.params.userId;
  // Token oluştururken owner alanını eklemelisin!
  const tokens = await Token.find({ owner: userId });
  res.json(tokens);
};

exports.transferToken = async (req, res) => {
  const { tokenAddress, to, amount } = req.body;
  try {
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL); // örnek ağ
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const token = new ethers.Contract(tokenAddress, TokenArtifact.abi, wallet);
    const tx = await token.transfer(to, amount);
    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};