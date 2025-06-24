const Influencer = require('./../models/influencer');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const Order = require('../models/order'); 


exports.getAllInfluencers = factory.getAllOne(Influencer);
exports.createInfluencer = factory.createOne(Influencer);
exports.deleteInfluencer = factory.deleteOne(Influencer);
exports.updateInfluencer = factory.updateOne(Influencer);
exports.getInfluencer = factory.getOne(Influencer);

exports.getInfluencerByCode = catchAsync(async (req, res, next) => {
  const influencer = await Influencer.findOne({ code: req.params.code });

  if (!influencer) {
    return next(new AppError('No influencer found with that referral code', 404));
  }

  res.status(200).json({
    status: 'success',
    data: influencer
  });
});



exports.getCodeCount = catchAsync(async (req, res, next) => {
  const count = await Order.countDocuments({ influencerCode: req.params.code });

  res.status(200).json({
    status: 'success',
    data: {
      code: req.params.code,
      orderCount: count
    }
  });
});
