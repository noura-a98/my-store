const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  webhookController.webhookCheckout
);

module.exports = router;
