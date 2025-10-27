const Token = require("../models/Token");

exports.generateWhitepaper = async (req, res) => {
  const { tokenId } = req.params;
  const token = await Token.findById(tokenId);
  if (!token) return res.status(404).json({ error: "Token bulunamadı" });

  // Basit örnek: PDF yerine düz metin döndür
  const doc = `
Token Adı: ${token.name}
Sembol: ${token.symbol}
Arz: ${token.initialSupply}
Ağ: ${token.network}
Özellikler: Mint: ${token.canMint}, Burn: ${token.canBurn}, Pause: ${token.canPause}
Kontrat Adresi: ${token.address}
Tarih: ${token.createdAt}
  `;
  res.type("text/plain").send(doc);
};

// TokenGallery bileşeninde tablo satırına ekle
<td>
  <button onClick={() => window.open(`/api/whitepaper/${token._id}`, "_blank")}>
    Whitepaper
  </button>
</td>