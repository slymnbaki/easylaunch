const express = require("express");
const router = express.Router();
const { createLaunchpad, listLaunchpads, buyToken, userPurchases } = require("../controllers/launchpadController");

router.post("/create", createLaunchpad);
router.get("/list", listLaunchpads);
router.post("/buy", buyToken);
router.get("/purchases/:buyer", userPurchases);

module.exports = router;