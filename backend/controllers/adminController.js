const Token = require("../models/Token");
const User = require("../models/User");
const Launchpad = require("../models/Launchpad");

exports.getStats = async (req, res) => {
  try {
    const tokenCount = await Token.countDocuments();
    const userCount = await User.countDocuments();
    const launchpadCount = await Launchpad.countDocuments();
    const kycPending = await User.countDocuments({ kycStatus: "pending" });
    const kycApproved = await User.countDocuments({ kycStatus: "approved" });
    res.json({
      tokenCount,
      userCount,
      launchpadCount,
      kycPending,
      kycApproved,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};