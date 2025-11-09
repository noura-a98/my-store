const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Phone Number is required!']
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
    required: [true, 'Quantity is required.']
  },
  deliveryFee: {
    type: Number,
    required: [true, 'Delivery fee is required.']
  },
  productPrice: {
    type: Number,
    required: [true, 'A product has to have a price!']
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required!']
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
    enum: [
      'pending',
      'processing',
      'assigned',
      'out-for-delivery',
      'delivered',
      'cancelled'
    ],
  
    default: 'pending'
  },
   message: {
    type: String,
    default: null // or you can make it optional without default
  },
  orderNumber: {
    type: String,
    unique: true
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
