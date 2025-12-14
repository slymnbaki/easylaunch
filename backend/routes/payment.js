
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Fiyat sorgulama endpointi
router.get('/price/fetch', paymentController.getPrice);

// Gerçek ödeme oluşturma endpointi
router.post('/create', paymentController.createPayment);

// Gerçek ödeme durumu sorgulama endpointi
router.get('/:id', paymentController.getPayment);

module.exports = router;
