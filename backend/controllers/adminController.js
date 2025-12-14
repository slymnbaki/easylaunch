const Token = require("../models/Token");
const User = require("../models/User");
const Launchpad = require("../models/Launchpad");

async function getDocumentCounts() {
  return Promise.all([
    Token.countDocuments(),
    User.countDocuments(),
    Launchpad.countDocuments(),
    User.countDocuments({ kycStatus: "pending" }),
    User.countDocuments({ kycStatus: "approved" })
  ]);
}


exports.getStats = async (req, res) => {
  try {
    const stats = await exports.getStatsRaw();
    res.json({ success: true, ...stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Admin dashboard summary (ham veri, API içi kullanıma uygun)
exports.getStatsRaw = async () => {
  const [tokenCount, userCount, launchpadCount, kycPending, kycApproved] = await getDocumentCounts();
  const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentTokens = await Token.countDocuments({ createdAt: { $gte: last24h } });
  return {
    stats: {
      tokenCount,
      userCount,
      launchpadCount,
      kycPending,
      kycApproved,
      recentTokens,
      timestamp: new Date().toISOString()
    }
  };
};