const express = require("express");
const router = express.Router();
const { auditToken } = require("../controllers/auditController");

router.get("/token", auditToken);

module.exports = router;