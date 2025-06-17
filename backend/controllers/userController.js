const AppError = require('../utils/appError');
const User = require('../models/user');
const catchAsync = require ('./../utils/catchAsync');


exports.getAllUsers= catchAsync(async (req, res, next) => {
        const users = await User.find();

        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users: users
            }
        });
    
});

exports.getUser = catchAsync(async(req , res , next) => {
    const user = await User.findById(req.params.id);
    if(!user){
        return next(new AppError('No user found with that ID.' , 404));
    }
    res.status(200).json({
        status : 'success',
        data:{
            user : user
        }
    });
});

exports.deleteUser = catchAsync(async(req , res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user){
        return next(new AppError('No user found with that ID.', 404));
        
    }
    res.status(204).json({
        status : 'success',
        data : null
    })
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // this will return the new updated document instead of the original one
    runValidators: true, // this will run the validators on the updated document
  });
  if(!user){
    return next(new AppError('No product found with that ID', 404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

