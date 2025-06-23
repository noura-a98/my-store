const AppError = require('../utils/appError');
const User = require('../models/user');
const catchAsync = require ('./../utils/catchAsync');
const factory = require('./handlerFactory');


// const filterObj = (obj , ...allowedFields)=> {
//   const newObj = {};
//   Object.keys(obj).forEach(el => {
//     if(allowedFields.includes(el)) newObj[el] = obj[el];
//   });
// return newObj;
// }


// exports.updateMe = catchAsync(async(req , res , next) => {

//   if(req.body.password  || req.body.passwordConfirm ) {
//     return next(new AppError('This route does not handle password updates, visit /update-password'),404);
//   }
//   const filteredBody = filterObj(req.body,filteredBody)
//   const updatedUser = await User.findByIdAndUpdate(req.user.id , x , {
//     new: true,
//     runValidators:true
//   });

//   res.status(200).json({
//     staus : 'success',
//     data: {
//       user:updatedUser
//     }
//   })


  
// });
exports.getAllUsers = factory.getAllOne(User);
exports.deleteUser = factory.deleteOne(User);
exports.updateUser = factory.updateOne(User);
exports.getUser = factory.getOne(User);

exports.deleteMe = catchAsync(async (req, res, next) => {
         await User.findByIdAndUpdate(req.user.id , {active : false});

        res.status(204).json({
            status: 'success',
            data: null
        });
    
});

// exports.getAllUsers= catchAsync(async (req, res, next) => {
//         const users = await User.find();

//         res.status(200).json({
//             status: 'success',
//             results: users.length,
//             data: {
//                 users: users
//             }
//         });
    
// });

// exports.getUser = catchAsync(async(req , res , next) => {
//     const user = await User.findById(req.params.id);
//     if(!user){
//         return next(new AppError('No user found with that ID.' , 404));
//     }
//     res.status(200).json({
//         status : 'success',
//         data:{
//             user : user
//         }
//     });
// });

// exports.deleteUser = catchAsync(async(req , res, next) => {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if(!user){
//         return next(new AppError('No user found with that ID.', 404));
        
//     }
//     res.status(204).json({
//         status : 'success',
//         data : null
//     })
// });

// exports.updateUser = catchAsync(async (req, res, next) => {
//   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     new: true, // this will return the new updated document instead of the original one
//     runValidators: true, // this will run the validators on the updated document
//   });
//   if(!user){
//     return next(new AppError('No user found with that ID', 404))
//   }

//   res.status(200).json({
//     status: 'success',
//     message: 'user updated successfully.'

//   });
// });

