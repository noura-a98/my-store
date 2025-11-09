const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { model } = require('mongoose');
const Product = require('../models/product');
// handlerFactory.js
exports.getAllOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    
    // Only apply driver filter if user is authenticated and is a driver
    if (req.user && req.user.role === 'driver') {
      filter = { driverId: req.user._id };
    }

    let query = Model.find(filter);
    if (populateOptions) {
      populateOptions.forEach(option => {
        query = query.populate(option);
      });
    }

    const docs = await query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: docs
    });
  });

exports.createOne = (Model) => async (req, res, next) => {
  const doc = await Model.create(req.body);
  res.status(201).json({
    status : 'success',
     results: doc.length,
     data: doc
  });
};

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {

    const doc = await Model.findById(req.params.id);
    
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'sucess',
      data: doc
    });
  });


exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // this will return the new updated document instead of the original one
      runValidators: true, // this will run the validators on the updated document
    });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data : doc
    });
  });

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
      status: 'sucess',
      data: null, // return an empty object since we deleted the document
    });
  });