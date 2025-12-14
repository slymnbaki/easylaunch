const swaggerUi = require('swagger-ui-express');
const express = require('express');
const router = express.Router();

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Easylaunch API',
    version: '1.0.0',
    description: 'Token launch platformu için API dokümantasyonu'
  },
  paths: {
    '/api/kyc/submit': {
      post: {
        summary: 'KYC başvurusu',
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' }, name: { type: 'string' }, idNumber: { type: 'string' } }, required: ['email','name','idNumber'] } } } },
        responses: { 200: { description: 'Başvuru alındı' } }
      }
    },
    '/api/security/2fa/setup': {
      post: {
        summary: '2FA setup',
        requestBody: { content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string' } }, required: ['email'] } } } },
        responses: { 200: { description: '2FA secret' } }
      }
    }
  }
};

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

module.exports = router;
