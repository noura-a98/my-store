const User = require('../models/user');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');


exports.createAccount = catchAsync (async (req, res, next) => {
        const newUser = await User.create(req.body);

        const token = jwt.sign({id : newUser._id} , process.env.JWT_SECRET, {
            expiresIn : process.env.JWT_EXPIRES_IN
        });
        
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });

});

exports.login =  catchAsync (async (req, res, next) => {
        const {userName , password} = req.body;

        if(!userName || !password){
           return next(new AppError('Please provide username and password!',400));
        }

        // const user = User.findOne({userName}).select('+password')

        // const token = '';
        // res.status(200).json({
        //     status: 'success',
        //     token,
           
        // });

});


