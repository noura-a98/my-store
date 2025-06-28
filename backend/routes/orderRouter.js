const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');



router.use(authController.protect);// Protect all routes below


router.post('/',authController.restrictTo('admin'), orderController.createCashOrder);// create the order
router.get('/', authController.restrictTo('admin', 'driver'), orderController.getAllOrders);// Admin or driver can view all orders
router.get('/:id', authController.restrictTo('admin', 'driver'), orderController.getOrder);// Get specific order by ID
router.patch('/:id/status', authController.restrictTo('admin', 'driver'), orderController.updateOrderStatus);// Update order status (admin or driver)
router.patch('/:id/assign-driver', authController.restrictTo('admin'), orderController.assignDriver);// Assign driver (admin only)
router.delete('/:id', authController.restrictTo('admin'), orderController.deleteOrder);


module.exports = router;
