const express = require('express');
const router = express.Router();


const aiController = require('../controllers/aiController');
// Ana AI endpoint: token suggestion
router.post('/suggestion', aiController.getSuggestion);

module.exports = router;
