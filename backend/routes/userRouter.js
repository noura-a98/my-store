// routes/userRouter.js
const express = require('express');
const { route } = require('../app');
const router = express.Router();

const authController = require('./../controllers/userController');

router.post('login' , authController.login);
router.post('create-account' , authController.createAccount);
module.exports = router;
