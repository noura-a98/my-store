const mongoose = require('mongoose');

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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Influencer = mongoose.model('Influencer', InfluencerSchema);

module.exports = Influencer;
