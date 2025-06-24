const Order = require('../models/order');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// Create order
const User = require('../models/user');
const Product = require('../models/product');

exports.getAllOrders = factory.getAllOne(Order);
exports.getOrder = factory.getOne(Order);


exports.createOrder = catchAsync(async (req, res, next) => {
  const { driverId, product } = req.body;

  // Validate driver exists
  if (driverId) {
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return next(new AppError('Invalid or missing driver', 400));
    }
  }

  // Validate product exists
  const existingProduct = await Product.findById(product);
  if (!existingProduct) {
    return next(new AppError('Product not found', 400));
  }

  const newOrder = await Order.create(req.body);

  res.status(201).json({
    status: 'success',
    data: newOrder
  });
});


// Update status
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return next(new AppError('Order not found', 404));
  res.status(200).json({ status: 'success', data: order });
});

// Assign driver
exports.assignDriver = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { driverId: req.body.driverId }, { new: true });
  if (!order) return next(new AppError('Order not found', 404));
  res.status(200).json({ status: 'success', data: order });
});
