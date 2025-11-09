const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const deliveryFeeController = require('../controllers/deliveryFeeController');


router.get('/', deliveryFeeController.getAllFees);
router.use(authController.protect,authController.restrictTo('admin'));
router.get('/:id',deliveryFeeController.getFee);
router.post('/',deliveryFeeController.createFee);
router.patch('/:id',deliveryFeeController.updateFee);
router.delete('/:id',deliveryFeeController.deleteFee);


module.exports = router;
