const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');



router.post('/login',authController.login);

router.use(authController.protect,authController.restrictTo('admin'));

router.get('/', userController.getAllUsers);
router.post('/createAccount', authController.createAccount);
router.get('/:id', userController.getUser);

router.patch('/update-password',authController.updatePassword);// admin updates their password
router.patch('/update-password/:id',authController.updateUsersPassword);// admin updates users password
router.patch('/:id',userController.updateUser);

router.delete('/deleteMe',userController.deleteMe);
router.delete('/:id',userController.deleteUser);

module.exports = router;

