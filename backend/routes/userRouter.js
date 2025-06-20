const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');


router.get('/',authController.protect, userController.getAllUsers);
router.post('/createAccount', authController.createAccount);
router.post('/login',authController.login);
router.get('/:id', userController.getUser);
router.delete('/:id',authController.protect,authController.restrictTo('admin'), userController.deleteUser);
router.patch('/:id', userController.updateUser);

module.exports = router;
