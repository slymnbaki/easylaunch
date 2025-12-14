const axios = require("axios");
const Token = require("../models/Token");

// AI Token Suggestion Controller
exports.getSuggestion = async (req, res) => {
  const { category, purpose, audience, budget } = req.body;

  // Validasyon
  if (!category || !purpose) {
    return res.status(400).json({
      success: false,
      message: "❌ Kategori ve token amacı gerekli"
    });
  }

  try {

    // Gerçek OpenAI API entegrasyonu
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) return res.status(500).json({ success: false, error: 'OpenAI API anahtarı eksik' });
    const prompt = `Kategori: ${category}\nAmaç: ${purpose}\nHedef kitle: ${audience || 'belirtilmedi'}\nBütçe: ${budget || 'belirtilmedi'}\nBu bilgilerle hangi blockchain ağı ve token özellikleri önerirsin? Kısa ve teknik yanıt ver.`;
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        }
      });
      const suggestion = response.data.choices?.[0]?.message?.content || 'Cevap alınamadı';
      return res.json({ success: true, suggestion, mode: 'ai' });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

  } catch (err) {
    console.error("❌ AI öneri hatası:", err.message);
    return res.status(500).json({
      success: false,
      message: "AI öneri hatası: " + err.message
    });
  }
};

// Mock Suggestion Generator
function generateMockSuggestion(category, purpose, audience, budget) {
  const categoryPresets = {
    "gaming": {
      name: "GameVault Token",
      symbol: "GVT",
      supply: 10000000,
      features: { canMint: true, canBurn: false, canPause: true },
      network: "polygon",
      reasoning: "🎮 Gaming tokenları hızlı işlem gerektirir (Polygon düşük gas), oyun içi ödüller için mint özelliği, acil durumlar için pause özelliği önerilir."
    },
    "defi": {
      name: "YieldMax Token",
      symbol: "YMAX",
      supply: 50000000,
      features: { canMint: false, canBurn: true, canPause: false },
      network: "mainnet",
      reasoning: "💰 DeFi tokenleri deflasyonist olmalı (burn), merkeziyetsizlik için pause olmamalı, güvenlik için Ethereum mainnet tercih edilir."
    },
    "nft": {
      name: "ArtVerse Token",
      symbol: "ARTV",
      supply: 1000000,
      features: { canMint: true, canBurn: true, canPause: false },
      network: "polygon",
      reasoning: "🎨 NFT platformları düşük gas (Polygon), yeni koleksiyonlar için mint, nadirlik için burn özelliği önerilir."
    },
    "meme": {
      name: "MoonRocket Token",
      symbol: "MOON",
      supply: 1000000000000,
      features: { canMint: false, canBurn: true, canPause: false },
      network: "bsc",
      reasoning: "🚀 Meme tokenleri BSC'de başarılı (düşük ücret, yüksek hacim), büyük arz (küçük birim fiyat), burn ile hype yaratılır."
    },
    "utility": {
      name: "ServicePay Token",
      symbol: "SPY",
      supply: 100000000,
      features: { canMint: true, canBurn: false, canPause: true },
      network: "bsc",
      reasoning: "🔧 Utility tokenları esneklik gerektirir (mint), servis kesintilerinde pause, BSC ile düşük işlem maliyeti."
    }
  };

  // Bütçeye göre ağ önerisi
  let recommendedNetwork = "sepolia"; // default testnet
  if (budget && parseInt(budget) > 100) {
    recommendedNetwork = category === "defi" ? "mainnet" : "polygon";
  } else if (budget && parseInt(budget) > 50) {
    recommendedNetwork = "polygon";
  }

  // Kategori varsa preset kullan
  if (categoryPresets[category]) {
    const preset = categoryPresets[category];
    return {
      ...preset,
      network: budget && parseInt(budget) < 50 ? "sepolia" : preset.network,
      customization: {
        purposeAnalysis: `Token amacınız "${purpose}" ile ${category} kategorisi uyumlu.`,
        audienceNote: audience ? `Hedef kitleniz (${audience}) için önerildi.` : "Hedef kitle belirtilmedi.",
        budgetNote: budget ? `Bütçeniz ($${budget}) ${recommendedNetwork} ağını öneriyor.` : "Bütçe belirtilmedi, testnet önerilir."
      }
    };
  }

  // Generic öneri
  return {
    name: purpose.split(' ').slice(0, 2).join('') + " Token",
    symbol: purpose.substring(0, 4).toUpperCase(),
    supply: budget && parseInt(budget) < 10 ? 1000000 : 100000000,
    features: {
      canMint: true,
      canBurn: false,
      canPause: false
    },
    network: recommendedNetwork,
    reasoning: `📝 "${purpose}" amacınız için genel token yapılandırması önerildi. Daha spesifik öneriler için kategori seçin.`,
    customization: {
      purposeAnalysis: purpose,
      audienceNote: audience || "Hedef kitle belirtilmedi",
      budgetNote: budget ? `Bütçe: $${budget}` : "Bütçe belirtilmedi"
    }
  };
}

// Mock AI audit function (OpenAI olmadan)
const generateMockAudit = (tokenData) => {
  // Risk skorunu hesapla
  let riskScore = 0;
  const risks = [];
  const recommendations = [];

  // Mint kontrolü
  if (tokenData.canMint) {
    riskScore += 30;
    risks.push("Token supply artırılabilir (Mint enabled)");
    recommendations.push("Mint yetkisini güvenilir multi-sig wallet'a devredin");
  }

  // Pause kontrolü
  if (tokenData.canPause) {
    riskScore += 20;
    risks.push("Token transferleri durdurulabilir (Pause enabled)");
    recommendations.push("Pause fonksiyonunu sadece acil durumlarda kullanın");
  }

  // Burn kontrolü
  if (tokenData.canBurn) {
    riskScore += 10;
    risks.push("Token yakılabilir (Burn enabled)");
    recommendations.push("Burn işlemlerini şeffaf bir şekilde duyurun");
  }

  // Supply büyüklüğü kontrolü
  const supply = tokenData.initialSupply || 0;
  if (supply > 1000000000000) { // 1 trilyon üzeri
    riskScore += 25;
    risks.push("Çok yüksek token arzı - Enflasyon riski");
    recommendations.push("Token ekonomisini yeniden değerlendirin");
  }

  // Owner kontrolü
  if (!tokenData.owner) {
    riskScore += 15;
    risks.push("Owner adresi belirsiz");
    recommendations.push("Contract ownership'i açıkça belirleyin");
  }

  // Risk seviyesi belirleme
  let riskLevel = "LOW";
  let riskColor = "#00ff88";
  let riskEmoji = "✅";

  if (riskScore >= 60) {
    riskLevel = "HIGH";
    riskColor = "#ff006e";
    riskEmoji = "🔴";
  } else if (riskScore >= 30) {
    riskLevel = "MEDIUM";
    riskColor = "#ffa500";
    riskEmoji = "🟡";
  }

  // Güvenlik özellikleri
  const securityFeatures = [
    { name: "OpenZeppelin Standard", status: true, description: "ERC-20 standardına uyumlu" },
    { name: "Pausable", status: tokenData.canPause, description: "Acil durum koruması" },
    { name: "Burnable", status: tokenData.canBurn, description: "Token deflationary mekanizma" },
    { name: "Mintable", status: tokenData.canMint, description: "Supply artırma yeteneği" }
  ];

  // Complexity skoru (basit = 0-30, orta = 31-60, karmaşık = 61-100)
  const complexity = Math.min(100, 
    (tokenData.canMint ? 25 : 0) +
    (tokenData.canPause ? 25 : 0) +
    (tokenData.canBurn ? 15 : 0) +
    (supply > 1000000000 ? 20 : 10) +
    15 // Base complexity
  );

  return {
    success: true,
    mode: "AI_MOCK",
    timestamp: new Date().toISOString(),
    tokenAddress: tokenData.address,
    tokenName: tokenData.name,
    tokenSymbol: tokenData.symbol,
    network: tokenData.network,
    audit: {
      riskLevel,
      riskScore,
      riskColor,
      riskEmoji,
      complexity,
      risks: risks.length > 0 ? risks : ["No significant risks detected"],
      recommendations: recommendations.length > 0 ? recommendations : [
        "Token standard best practices'e uygun",
        "Smart contract deploy edildiğinde external audit düşünün",
        "Community'ye token detaylarını şeffaf bir şekilde bildirin"
      ],
      securityFeatures,
      summary: `${riskEmoji} Risk Level: ${riskLevel} (${riskScore}/100) | Complexity: ${complexity}/100`
    }
  };
};

exports.auditTokenAI = async (req, res) => {
  try {
    const { tokenAddress } = req.params;

    if (!tokenAddress) {
      return res.status(400).json({ 
        success: false, 
        message: "Token adresi gerekli" 
      });
    }

    // MongoDB'den token bilgisini al
    const token = await Token.findOne({ address: tokenAddress });

    if (!token) {
      return res.status(404).json({ 
        success: false, 
        message: "Token bulunamadı" 
      });
    }

    console.log(`🔍 AI Audit başlatıldı: ${token.name} (${token.symbol})`);


    // Gerçek OpenAI ile kod güvenlik analizi
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) return res.status(500).json({ success: false, error: 'OpenAI API anahtarı eksik' });
    const prompt = `Aşağıdaki token bilgilerini güvenlik açısından analiz et ve riskleri kısa maddeler halinde belirt:\n${JSON.stringify(token)}`;
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        }
      });
      const details = response.data.choices?.[0]?.message?.content || 'Cevap alınamadı';
      return res.json({ success: true, details, mode: 'ai' });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

  } catch (err) {
    console.error("AI Audit Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Audit işlemi sırasında hata oluştu",
      error: err.message 
    });
  }
};