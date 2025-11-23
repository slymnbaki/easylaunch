const express = require("express");
const router = express.Router();
const { kycRequest, kycApprove, kycReject, listKYC, kycStatus } = require("../controllers/userController");

router.post("/kyc-request", kycRequest);
router.post("/kyc-approve/:id", kycApprove);
router.post("/kyc-reject/:id", kycReject);
router.get("/kyc-list", listKYC);
router.get("/kyc-status/:userId", kycStatus);

module.exports = router;