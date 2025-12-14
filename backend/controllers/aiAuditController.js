const Token = require("../models/Token");

// Mock AI audit function (OpenAI olmadan)
const generateMockAudit = (tokenData) => {
  let riskScore = 0;
  const risks = [];
  const recommendations = [];

  if (tokenData.canMint) {
    riskScore += 30;
    risks.push("Token supply artırılabilir (Mint enabled)");
    recommendations.push("Mint yetkisini güvenilir multi-sig wallet'a devredin");
  }

  if (tokenData.canPause) {
    riskScore += 20;
    risks.push("Token transferleri durdurulabilir (Pause enabled)");
    recommendations.push("Pause fonksiyonunu sadece acil durumlarda kullanın");
  }

  if (tokenData.canBurn) {
    riskScore += 10;
    risks.push("Token yakılabilir (Burn enabled)");
    recommendations.push("Burn işlemlerini şeffaf bir şekilde duyurun");
  }

  const supply = tokenData.initialSupply || 0;
  if (supply > 1000000000000) {
    riskScore += 25;
    risks.push("Çok yüksek token arzı - Enflasyon riski");
    recommendations.push("Token ekonomisini yeniden değerlendirin");
  }

  if (!tokenData.owner) {
    riskScore += 15;
    risks.push("Owner adresi belirsiz");
    recommendations.push("Contract ownership'i açıkça belirleyin");
  }

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

  const securityFeatures = [
    { name: "OpenZeppelin Standard", status: true, description: "ERC-20 standardına uyumlu" },
    { name: "Pausable", status: tokenData.canPause, description: "Acil durum koruması" },
    { name: "Burnable", status: tokenData.canBurn, description: "Token deflationary mekanizma" },
    { name: "Mintable", status: tokenData.canMint, description: "Supply artırma yeteneği" }
  ];

  const complexity = Math.min(100, 
    (tokenData.canMint ? 25 : 0) +
    (tokenData.canPause ? 25 : 0) +
    (tokenData.canBurn ? 15 : 0) +
    (supply > 1000000000 ? 20 : 10) +
    15
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
      const response = await require('axios').post('https://api.openai.com/v1/chat/completions', {
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