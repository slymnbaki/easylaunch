const express = require('express');
const router = express.Router();
const swapController = require('../controllers/swapController');

// Swap endpoint: Token <-> Token or Token <-> Native
router.post('/', swapController.swapTokens);

module.exports = router;
