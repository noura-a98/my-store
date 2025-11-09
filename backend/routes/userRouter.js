const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

// Public routes
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Protected routes (require authentication but allow all roles)
router.use(authController.protect);

// Current user route - accessible by all authenticated users (admin, driver, influencer)
router.get('/me', userController.getMe, userController.getUser);

// Admin-only routes
router.use(authController.restrictTo('admin'));

router.get('/', userController.getAllUsers);
router.post('/createAccount', authController.createAccount);
router.get('/:id', userController.getUser);

router.patch('/update-password', authController.updatePassword); // admin updates their password
router.patch('/update-password/:id', authController.updateUsersPassword); // admin updates users password
router.patch('/:id', userController.updateUser);

router.delete('/deleteMe', userController.deleteMe);
router.delete('/:id', userController.deleteUser);

module.exports = router;