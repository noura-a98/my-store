const User = require('../models/user');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const {promisify} = require('util');


const signToken = id => {
    return jwt.sign({id :id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_IN
    });
}
    

exports.createAccount = catchAsync (async (req, res, next) => {
        const newUser = await User.create(req.body);

        const token = signToken( newUser._id);
        
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
    // 1) check if username and password exist
        if(!userName || !password){
           return next(new AppError('Please provide username and password!',400));
        }

    // 2) check if user exists && password is correct.
        const user = await User.findOne({userName}).select('+password');
        

        if(!user || !await user.correctPassword(password,user.password)){ 
            return next(new AppError('Incorrect email or password.',401))
        }

    // 3) if everything ok, send token to client
        const token = signToken(user._id);
        res.status(200).json({
            status: 'success',
            token,
           
        });

});

exports.protect = catchAsync(async (req, res , next) => {

    // 1) getting token and check if its there
    let token;

    if(
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    // console.log(token);

    if(!token) {
        return next(new AppError('You are not logged in! Please login to get access.' ,401));
    }
    // 2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);


   // 3) check if user still exists

    const freshUser = await User.findById(decoded.id);
    if(!freshUser){
        return next (new AppError('The user belonging to this token does no longer exist.',401));
    }
    // 4) check if user changed password after jwt is issued

    if(freshUser.changePasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please login again.',401));
    }


    // grant eccess to protected route

    req.user = freshUser;
next();
}); 

exports.restrictTo = (...roles) => {
     return(req, res , next) =>{
        if(!roles.includes(req.user.role)){
            return next(new AppError('You do not have permission to perform this action.' ,403)
        );
        }
        next();
     }
}


