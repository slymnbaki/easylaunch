const express = require('express');
const router = express.Router();


const aiAuditController = require('../controllers/aiAuditController');
// Ana AI Audit endpoint: token audit
router.post('/audit', aiAuditController.auditTokenAI);

module.exports = router;
