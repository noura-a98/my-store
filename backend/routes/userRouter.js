// routes/userRouter.js
const express = require('express');
// const { route } = require('../app');
const router = express.Router();

const authController = require('./../controllers/authController');

router.post('createAccount' , authController.createAccount);
// router.post('create-account' , authController.createAccount);
module.exports = router;
