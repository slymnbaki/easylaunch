const { ethers } = require("ethers");
const Token = require("../models/Token");
const Payment = require("../models/Payment");
const axios = require("axios");
const sendEmail = require("../utils/email");

// Network configuration
const getNetworkConfig = (network) => {
  const configs = {
    sepolia: {
      rpcUrl: process.env.SEPOLIA_RPC_URL,
      privateKey: process.env.PRIVATE_KEY,
      name: "Sepolia Testnet",
      explorer: "https://sepolia.etherscan.io"
    },
    holesky: {
      rpcUrl: process.env.HOLESKY_RPC_URL,
      privateKey: process.env.PRIVATE_KEY,
      name: "Holesky Testnet",
      explorer: "https://holesky.etherscan.io"
    },
    mainnet: {
      rpcUrl: process.env.MAINNET_RPC_URL,
      privateKey: process.env.PRIVATE_KEY,
      name: "Ethereum Mainnet",
      explorer: "https://etherscan.io"
    },
    "bsc-testnet": {
      rpcUrl: process.env.BSC_TESTNET_RPC_URL,
      privateKey: process.env.BSC_PRIVATE_KEY,
      name: "BSC Testnet",
      explorer: "https://testnet.bscscan.com"
    },
    bsc: {
      rpcUrl: process.env.BSC_RPC_URL,
      privateKey: process.env.BSC_PRIVATE_KEY,
      name: "BSC Mainnet",
      explorer: "https://bscscan.com"
    },
    "polygon-mumbai": {
      rpcUrl: process.env.POLYGON_MUMBAI_RPC_URL,
      privateKey: process.env.POLYGON_PRIVATE_KEY,
      name: "Polygon Mumbai",
      explorer: "https://mumbai.polygonscan.com"
    },
    polygon: {
      rpcUrl: process.env.POLYGON_RPC_URL,
      privateKey: process.env.POLYGON_PRIVATE_KEY,
      name: "Polygon Mainnet",
      explorer: "https://polygonscan.com"
    },
    "avalanche-fuji": {
      rpcUrl: process.env.AVALANCHE_FUJI_RPC_URL,
      privateKey: process.env.AVALANCHE_PRIVATE_KEY,
      name: "Avalanche Fuji",
      explorer: "https://testnet.snowtrace.io"
    },
    avalanche: {
      rpcUrl: process.env.AVALANCHE_RPC_URL,
      privateKey: process.env.AVALANCHE_PRIVATE_KEY,
      name: "Avalanche Mainnet",
      explorer: "https://snowtrace.io"
    }
  };

  return configs[network];
};

// Token deployment
exports.deployToken = async (req, res) => {
  try {
    const { 
      captcha, 
      name, 
      symbol, 
      initialSupply, 
      canMint, 
      canPause, 
      canBurn, 
      network, 
      email,
      paymentId,
      packageType 
    } = req.body;


    // reCAPTCHA doğrulama
    if (!captcha) {
      return res.status(400).json({ error: "reCAPTCHA doğrulaması gerekli" });
    }

    const captchaResponse = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET,
          response: captcha
        }
      }
    );

    if (!captchaResponse.data.success) {
      return res.status(400).json({ error: "reCAPTCHA doğrulaması başarısız" });
    }

    // Ödeme kontrolü (Free package hariç)
    if (packageType !== "free") {
      if (!paymentId) {
        return res.status(400).json({ error: "Ödeme yapılmamış!" });
      }

      const payment = await Payment.findById(paymentId);
      if (!payment) {
        return res.status(400).json({ error: "Ödeme bulunamadı!" });
      }

      // Blockchain transferini Etherscan API ile doğrula
      const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "YOUR_ETHERSCAN_API_KEY";
      const platformWallet = process.env.REACT_APP_PLATFORM_WALLET;
      const txHash = payment.txHash;
      const amount = payment.amount;
      let transferConfirmed = false;
      try {
        const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${platformWallet}&sort=desc&apikey=${ETHERSCAN_API_KEY}`;
        const response = await axios.get(url);
        if (response.data.status === "1" && response.data.result) {
          const incomingTx = response.data.result.find(tx => tx.hash.toLowerCase() === txHash.toLowerCase() && tx.to.toLowerCase() === platformWallet.toLowerCase() && tx.value === ethers.parseUnits(amount, "ether").toString());
          if (incomingTx) transferConfirmed = true;
        }
      } catch (err) {
        return res.status(400).json({ error: "Blockchain ödeme doğrulaması başarısız: " + err.message });
      }
      if (!transferConfirmed) {
        return res.status(400).json({ error: "Blockchain üzerinde ödeme transferi bulunamadı!" });
      }

      if (payment.status !== "confirmed") {
        return res.status(400).json({ 
          error: "Ödeme henüz onaylanmamış. Lütfen bekleyin...",
          paymentStatus: payment.status
        });
      }
      if (payment.used) {
        return res.status(400).json({ error: "Bu ödeme daha önce kullanılmış!" });
      }
      // Email kontrolü
      if (payment.userEmail.toLowerCase() !== email.toLowerCase()) {
        return res.status(400).json({ error: "Email adresi ödeme ile eşleşmiyor!" });
      }
    }

    // Network configuration
    const networkConfig = getNetworkConfig(network);
    if (!networkConfig) {
      return res.status(400).json({ error: `Desteklenmeyen ağ: ${network}` });
    }


    // Provider ve Wallet
    const provider = new ethers.JsonRpcProvider(networkConfig.rpcUrl);
    const wallet = new ethers.Wallet(networkConfig.privateKey, provider);


    // Smart Contract ABI ve Bytecode
    const contractABI = [
      "constructor(string memory name, string memory symbol, uint256 initialSupply, bool canMint, bool canPause, bool canBurn)",
      "function name() view returns (string)",
      "function symbol() view returns (string)",
      "function totalSupply() view returns (uint256)",
      "function balanceOf(address) view returns (uint256)"
    ];

    const contractBytecode = `0x${require("../contracts/MyToken.json").bytecode}`;

    // Contract Factory
    const factory = new ethers.ContractFactory(contractABI, contractBytecode, wallet);

    // Deploy
    
    const contract = await factory.deploy(
      name,
      symbol,
      ethers.parseUnits(initialSupply.toString(), 18),
      canMint,
      canPause,
      canBurn
    );

    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();


    // Veritabanına kaydet
    const token = await Token.create({
      name,
      symbol,
      initialSupply,
      canMint,
      canPause,
      canBurn,
      network,
      contractAddress,
      ownerEmail: email,
      packageType: packageType || "free",
      paymentId: paymentId || null,
      deployerAddress: wallet.address,
      txHash: contract.deploymentTransaction().hash,
      status: "deployed"
    });

    // Ödemeyi kullanıldı olarak işaretle
    if (paymentId && packageType !== "free") {
      await Payment.findByIdAndUpdate(paymentId, {
        used: true,
        tokenAddress: contractAddress
      });
    }

    // Email gönder
    const explorerUrl = `${networkConfig.explorer}/address/${contractAddress}`;
    
    try {
      await sendEmail(
        email,
        "Token Başarıyla Oluşturuldu! 🎉",
        `
        <h2>Tebrikler! Token'ınız başarıyla oluşturuldu.</h2>
        <p><strong>Token Adı:</strong> ${name}</p>
        <p><strong>Sembol:</strong> ${symbol}</p>
        <p><strong>Ağ:</strong> ${networkConfig.name}</p>
        <p><strong>Contract Adresi:</strong> ${contractAddress}</p>
        <p><strong>Explorer:</strong> <a href="${explorerUrl}">${explorerUrl}</a></p>
        <hr>
        <p>Token'ınızı MetaMask'a ekleyebilirsiniz:</p>
        <ul>
          <li>Token Contract Address: ${contractAddress}</li>
          <li>Token Symbol: ${symbol}</li>
          <li>Decimals: 18</li>
        </ul>
        `
      );
    } catch (emailError) {
      // Email hatası deployment'ı engellemez
      // Email hatası deployment'ı engellemez
    }

    res.json({
      success: true,
      message: "Token başarıyla oluşturuldu!",
      token: {
        name,
        symbol,
        contractAddress,
        network: networkConfig.name,
        explorer: explorerUrl,
        txHash: contract.deploymentTransaction().hash
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Token oluşturulurken hata oluştu"
    });
  }
};

// Get user tokens
exports.getUserTokens = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Email gerekli" });
    }

    const tokens = await Token.find({ 
      ownerEmail: email.toLowerCase() 
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      tokens
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// Get token details
exports.getTokenDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const token = await Token.findById(id);
    
    if (!token) {
      return res.status(404).json({
        success: false,
        error: "Token bulunamadı"
      });
    }

    res.json({
      success: true,
      token
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};