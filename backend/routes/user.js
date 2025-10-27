const express = require("express");
const router = express.Router();
const { kycRequest, kycApprove, kycReject, listKYC, kycStatus } = require("../controllers/userController");

router.post("/kyc-request", kycRequest);
router.post("/kyc-approve/:id", kycApprove); // admin
router.post("/kyc-reject/:id", kycReject);   // admin
router.get("/kyc-list", listKYC);            // admin
router.get("/kyc-status/:userId", kycStatus);

await Token.create({
  name,
  symbol,
  initialSupply,
  canMint,
  canPause,
  canBurn,
  network,
  address: contract.target,
  owner: req.body.userId, // frontend'den userId gönderilmeli!
});

module.exports = router;