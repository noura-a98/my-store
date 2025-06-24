const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { model } = require('mongoose');

exports.getAllOne = Model =>  catchAsync(async (req, res, next) => {
 const doc = await Model.find();

    res.status(200).json({
        status : 'success',
        results: doc.length,
        data: doc
    })
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

    let query = Model.findById(req.params.id);
    // const doc = await Model.findById(req.params.id).populate('reviews');
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'sucess',
      data: {
        data : doc,
      },
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