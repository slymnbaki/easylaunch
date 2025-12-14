const PDFDocument = require('pdfkit');
const Token = require("../models/Token");

exports.generateWhitepaper = async (req, res) => {
  const { tokenId } = req.params;
  const token = await Token.findById(tokenId);
  if (!token) return res.status(404).json({ error: "Token bulunamadı" });

  // PDF oluştur
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=whitepaper_${token.symbol}.pdf`);
  doc.pipe(res);

  doc.fontSize(22).text('Token Whitepaper', { align: 'center' });
  doc.moveDown();
  doc.fontSize(14).text(`Token Adı: ${token.name}`);
  doc.text(`Sembol: ${token.symbol}`);
  doc.text(`Arz: ${token.initialSupply}`);
  doc.text(`Ağ: ${token.network}`);
  doc.text(`Kontrat Adresi: ${token.contractAddress}`);
  doc.text(`Tarih: ${token.createdAt.toLocaleString()}`);
  doc.moveDown();
  doc.text(`Özellikler:`);
  doc.text(`- Mint: ${token.canMint ? 'Evet' : 'Hayır'}`);
  doc.text(`- Burn: ${token.canBurn ? 'Evet' : 'Hayır'}`);
  doc.text(`- Pause: ${token.canPause ? 'Evet' : 'Hayır'}`);
  doc.moveDown();
  doc.text('Bu whitepaper Easylaunch platformu tarafından otomatik oluşturulmuştur.', { align: 'center', oblique: true });
  doc.end();
};
