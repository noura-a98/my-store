const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');





router.post('/', orderController.createCashOrder);// create the order
router.use(authController.protect);// Protect all routes below

router.get('/', authController.restrictTo('admin', 'driver'), orderController.getAllOrders);// Admin or driver can view all orders
router.get('/:id', authController.restrictTo('admin', 'driver'), orderController.getOrder);// Get specific order by ID
router.patch(
  '/:id/assign',
  authController.protect,
  authController.restrictTo('admin', 'driver'),
  orderController.assignDriverAndStatus
);

router.delete('/:id', authController.restrictTo('admin'), orderController.deleteOrder);


module.exports = router;
