const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');



// Protect all routes below
router.use(authController.protect);

// create the order
router.post('/',authController.restrictTo('admin'), orderController.createCashOrder);

// Admin or driver can view all orders
router.get('/', authController.restrictTo('admin', 'driver'), orderController.getAllOrders);

// Get specific order by ID
router.get('/:id', authController.restrictTo('admin', 'driver'), orderController.getOrder);

// Update order status (admin or driver)
router.patch('/:id/status', authController.restrictTo('admin', 'driver'), orderController.updateOrderStatus);

// Assign driver (admin only)
router.patch('/:id/assign-driver', authController.restrictTo('admin'), orderController.assignDriver);

// router.post('/checkoutSession/:productId',authController.protect,orderController.getCheckoutSession
    
// );
router.delete('/:id', authController.restrictTo('admin'), orderController.deleteOrder);


module.exports = router;
