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

const createSendToken = ( user , statusCode , res) => {
    const token = signToken( user._id);
    const cookieOptions =  {
        expires : new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 *60 * 60 * 1000),
        httpOnly : true 
    };
    if(process.env.NODE_ENV === 'production') cookieOptions.secure =true;

    res.cookie('jwt',token,cookieOptions);
    user.password = undefined;
    
        res.status(statusCode).json({
            status: 'success',
            token,
            data: {
                user
            }
        });

};



exports.createAccount = catchAsync(async (req, res, next) => {
  // Create userName from firstName and lastName
  const userName = `${req.body.firstName}.${req.body.lastName}`.toLowerCase();

  // Add userName to the request body
  req.body.userName = userName;

  const newUser = await User.create(req.body);

  createSendToken(newUser, 201, res);
});


exports.login =  catchAsync (async (req, res, next) => {
        const {userName , password} = req.body;
        
    // 1) check if username and password exist
        if(!userName || !password){
           return next(new AppError('Please provide username and password!',400));
        }

    // 2) check if user exists && password is correct.
        const user = await User.findOne({userName}).select('+password');
        console.log(user)

        if(!user || !await user.correctPassword(password,user.password)){ 
            return next(new AppError('Incorrect email or password.',401))
        }

    // 3) if everything ok, send token to client
        createSendToken(user,200,res);

    

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
};

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // triggers pre-save hooks like password hashing

  // 4) Log user in, send new JWT
    createSendToken(user,200,res);
});

// admin users password update
exports.updateUsersPassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('+password');

  if (!user) {
    return next(new AppError('No user found with that ID.', 404));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password updated successfully.'
  });
});


exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};
