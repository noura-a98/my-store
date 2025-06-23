const express = require('express');
const router = express.Router();


// router.patch('/updateProduct',upload.single('photo'),productController.updateProduct)
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');


router.get('/',authController.protect,authController.restrictTo('admin'), userController.getAllUsers);
router.post('/createAccount', authController.createAccount);
router.post('/login',authController.login);
router.get('/:id', userController.getUser);


router.patch('/update-password',authController.protect,authController.restrictTo('admin'), authController.updatePassword);

router.patch('/update-password/:id',authController.protect,authController.restrictTo('admin'), authController.updateUsersPassword);

router.patch('/:id',authController.protect, authController.restrictTo('admin'), userController.updateUser);

router.delete('/deleteMe',authController.protect, userController.deleteMe);

router.delete('/:id',authController.protect,authController.restrictTo('admin'), userController.deleteUser);

module.exports = router;
