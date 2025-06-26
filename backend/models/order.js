const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  shipping: {
    address: { type: String, required: true },
    city: { type: String, required: true }
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  influencerCode: {
    type: String,
    default: null
  },
    paymentMethod: {
    type: String,
    enum: ['cod', 'stripe'],
    default: 'cod'
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'assigned', 'out-for-delivery', 'delivered'],
    default: 'pending'
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
