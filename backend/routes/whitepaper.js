const express = require("express");
const router = express.Router();
const { generateWhitepaper } = require("../controllers/whitepaperController");

router.get("/:tokenId", generateWhitepaper);

module.exports = router;