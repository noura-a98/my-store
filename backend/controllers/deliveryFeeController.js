const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const deliveryFee = require('../models/deliveryFee');



exports.getAllFees = factory.getAllOne(deliveryFee);
exports.createFee = factory.createOne(deliveryFee);
exports.deleteFee = factory.deleteOne(deliveryFee);
exports.updateFee = factory.updateOne(deliveryFee);
exports.getFee = factory.getOne(deliveryFee);


