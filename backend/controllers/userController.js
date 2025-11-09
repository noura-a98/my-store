const AppError = require('../utils/appError');
const User = require('../models/user');
const catchAsync = require ('./../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllUsers = factory.getAllOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
exports.getUser = factory.getOne(User);
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.deleteMe = catchAsync(async (req, res, next) => {
         await User.findByIdAndUpdate(req.user.id , {active : false});

        res.status(204).json({
            status: 'success',
            data: null
        });
    
});
