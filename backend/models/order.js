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
  influencerCode: {
    type: String,
    default: null
  },
  stripeSession: {
    type: String,
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming drivers are stored in the users collection
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'assigned', 'out-for-delivery', 'delivered'],
    default: 'pending'
  },
  quantitiy : {
    type : Number
  }
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
