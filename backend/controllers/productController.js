const Product = require('./../models/product');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');


exports.getAllProducts = catchAsync(async(req , res,next) => {

    const products = await Product.find();

    res.status(200).json({
        status : 'success',
        results: products.length,
        data: products
    })
});

exports.createProduct = catchAsync(async(req, res , next) => {
    const product = await Product.create(req.body);
    
    res.status(201).json({
        status : 'success',
        data : product
    })
});

exports.deleteProduct = catchAsync(async(req , res, next) => {
   const product = await Product.findByIdAndDelete(req.params.id);
    if(!product){
    return next(new AppError('No product found with that ID', 404))
  }
    res.status(204).json({
        status :'success',
        data : null
    })
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // this will return the new updated document instead of the original one
    runValidators: true, // this will run the validators on the updated document
  });
  if(!product){
    return next(new AppError('No product found with that ID', 404))
  }
  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});
exports.getProduct = catchAsync(async(req , res, next) => {
    const product = await Product.findById(req.params.id);

    res.status(200).json({
        status :'success',
        data : product
    })
}); 