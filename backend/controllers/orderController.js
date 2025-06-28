const Order = require('../models/order');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const User = require('../models/user');
const Product = require('../models/product');
const DeliveryFee = require('../models/deliveryFee'); // make sure you import it

exports.createCashOrder = catchAsync(async (req, res, next) => {
  const {
    product,
    quantity,
    customerName,
    email,
    phone,
    shipping,
    influencerCode
  } = req.body;

  // Validate product
  const existingProduct = await Product.findById(product);
  if (!existingProduct) return next(new AppError('Product not found', 400));

  
  // Fetch delivery fee from city
  const cityFee = await DeliveryFee.findOne({ city: shipping.city });
  if (!cityFee) return next(new AppError('Delivery fee for this city not found', 400));

  const deliveryFee = cityFee.fee;
  const productPrice = existingProduct.price;
  const totalPrice = (existingProduct.price * quantity) + deliveryFee;

  existingProduct.stock -= quantity;
  await existingProduct.save();
  
  const newOrder = await Order.create({
    product,
    quantity,
    customerName,
    email,
    phone,
    shipping,
    influencerCode,
    paymentMethod: 'cod',
    productPrice,
    deliveryFee,
    totalPrice
  });

  res.status(201).json({
    status: 'success',
    data: newOrder
  });
});


// ✅ CRUD operations using factory functions
exports.getAllOrders = factory.getAllOne(Order);
exports.getOrder = factory.getOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
exports.updateOrder = factory.updateOne(Order);

// ✅ Update order status
exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  if (!order) return next(new AppError('Order not found', 404));

  res.status(200).json({
    status: 'success',
    data: order
  });
});

// Assign driver
exports.assignDriver = catchAsync(async (req, res, next) => {
  const { driverId } = req.body;

  // 1. Check if the user exists and is a driver
  const driver = await User.findById(driverId);
  if (!driver || driver.role !== 'driver') {
    return next(new AppError('Invalid driver ID or user is not a driver', 400));
  }

  // 2. Update the order
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { driverId },
    { new: true }
  );

  if (!order) return next(new AppError('Order not found', 404));

  res.status(200).json({
    status: 'success',
    data: order
  });
});



  //1) get the currently ordered product
//  exports.getCheckoutSession = catchAsync(async (req, res, next) => {
//   const product = await Product.findById(req.params.productId);
//   if (!product) return next(new AppError('Product not found', 404));

//   const { quantity, customerName, email, phone, address, city, influencerCode } = req.body;

//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     mode: 'payment',
//     success_url: `${req.protocol}://${req.get('host')}/success`,
//     cancel_url: `${req.protocol}://${req.get('host')}/cancel`,
//     customer_email: email,
//     client_reference_id: req.params.productId,
//     metadata: {
//       customerName,
//       phone,
//       address,
//       city,
//       quantity,
//       influencerCode: influencerCode || 'none'
//     },
//     line_items: [
//       {
//         price_data: {
//           currency: 'aed',
//           product_data: {
//             name: `${product.name}`,
//             description: product.description
//           },
//           unit_amount: product.price * 100 // convert to cents
//         },
//         quantity
//       }
//     ]
//   });

//   res.status(200).json({
//     status: 'success',
//     session
//   });
// });
