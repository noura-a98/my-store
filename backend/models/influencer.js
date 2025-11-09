const mongoose = require('mongoose');
const validator = require('validator');

const InfluencerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required!']
  },
  code: {
    type: String,
    required: [true, 'Code is required!'],
    unique: true,
    lowercase: true, 
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required!'],
    trim: true
  },
  instagram: {
    type: String,
    trim: true
  },
  tiktok: {
    type: String,
    trim: true
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Influencer = mongoose.model('Influencer', InfluencerSchema);
module.exports = Influencer;
