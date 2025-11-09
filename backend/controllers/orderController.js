const Order = require('../models/order');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');
const User = require('../models/user');
const Product = require('../models/product');
const DeliveryFee = require('../models/deliveryFee');
const emailService = require('../services/emailService'); // Import the email service

// Controller: createCashOrder
exports.createCashOrder = catchAsync(async (req, res, next) => {
  const {
    product,
    quantity,
    customerName,
    email,
    phone,
    shipping,
    influencerCode,
    message
  } = req.body;

  // Validate product
  const existingProduct = await Product.findById(product);
  if (!existingProduct) return next(new AppError('Product not found', 400));

  // Fetch delivery fee from city
  const cityFee = await DeliveryFee.findOne({ city: shipping.city });
  if (!cityFee) return next(new AppError('Delivery fee for this city not found', 400));

  const deliveryFee = cityFee.fee;
  const productPrice = existingProduct.price;
  const totalPrice = Number(((existingProduct.price * quantity) + deliveryFee).toFixed(2));

  // Reduce stock
  existingProduct.stock -= quantity;
  await existingProduct.save();

  // Create a custom order number (e.g. ORD + timestamp last 6 chars)
  const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

  // Create the order
  const newOrder = await Order.create({
    product,
    quantity,
    customerName,
    email,
    phone,
    shipping,
    influencerCode,
    message,
    paymentMethod: 'cod',
    productPrice,
    deliveryFee,
    totalPrice,
    orderNumber
  });

  // Populate the product field before sending response
  const populatedOrder = await Order.findById(newOrder._id).populate('product');

  // Prepare email data
  const orderData = {
    customerName,
    customerEmail: email,
    orderId: orderNumber,
    items: [{
      name: existingProduct.name,
      quantity: quantity,
      price: `${(existingProduct.price * quantity).toFixed(2)}`
    }],
    total: totalPrice.toFixed(2),
    shippingAddress: `${shipping.address}, ${shipping.city}`,
    deliveryFee: deliveryFee.toFixed(2),
    orderNotes: message || null
  };

  // Send emails (notification to admin and confirmation to customer)
  try {
    await emailService.handlePurchase(orderData);
    console.log(`Purchase emails sent successfully for order ${orderNumber}`);
  } catch (emailError) {
    // Log email error but don't fail the order creation
    console.error('Failed to send purchase emails:', emailError);
    // You could optionally add a flag to the order indicating email failure
    // or implement a retry mechanism
  }

  res.status(201).json({
    status: 'success',
    data: populatedOrder
  });
});

// ✅ CRUD operations using factory functions
exports.getAllOrders = factory.getAllOne(Order, [
  { path: 'product', select: 'name price' },
  { path: 'driverId', select: 'firstName lastName' }
]);

exports.getOrder = factory.getOne(Order);
exports.deleteOrder = factory.deleteOne(Order);
exports.updateOrder = factory.updateOne(Order);

// PATCH /api/v1/orders/:id/assign
exports.assignDriverAndStatus = catchAsync(async (req, res, next) => {
  const { driverId, status } = req.body;

  /* optional driver validation */
  if (driverId) {
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return next(new AppError('Invalid driver ID', 400));
    }
  }

  /* optional status validation */
  const allowed = [
    'pending',
    'processing',
    'assigned',
    'out-for-delivery',
    'delivered',
    'cancelled'
  ];
  if (status && !allowed.includes(status)) {
    return next(new AppError('Invalid status value', 400));
  }

  const update = {};
  if (driverId) update.driverId = driverId;
  if (status)   update.status   = status;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    update,
    { new: true }
  ).populate('driverId', 'firstName lastName');

  if (!order) return next(new AppError('Order not found', 404));

  res.status(200).json({ status: 'success', data: order });
});