const { ethers } = require("ethers");
const TokenArtifact = require("../../artifacts/contracts/Token.sol/Token.json");

exports.deployToken = async (req, res) => {
  const { name, symbol, initialSupply, canMint, canPause, canBurn, network } = req.body;

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

    res.json({ address: contract.target });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};