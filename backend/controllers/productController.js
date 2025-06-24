const Product = require('./../models/product');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');
// const factory = require('./handlerFactory');



const sharp = require('sharp');

// Store in memory for image processing
const multerStorage = multer.memoryStorage();

// Filter images only
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) cb(null, true);
  else cb(new AppError('Not an image! Please upload only images.', 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// Handle multiple fields
exports.uploadProductImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

exports.resizeProductImages = async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // Cover image
  const timestamp = Date.now();
  req.body.imageCover = `product-${timestamp}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(800, 800)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/products/${req.body.imageCover}`);

  // Product gallery images
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `product-${timestamp}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(800, 800)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/products/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
};


exports.getAllProducts = factory.getAllOne(Product);
exports.createProduct = factory.createOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.getProduct = factory.getOne(Product);


// exports.getAllProducts = catchAsync(async(req , res,next) => {

//     const products = await Product.find();

//     res.status(200).json({
//         status : 'success',
//         results: products.length,
//         data: products
//     })
// });

// exports.createProduct = catchAsync(async(req, res , next) => {
//     const product = await Product.create(req.body);
    
//     res.status(201).json({
//         status : 'success',
//         data : product
//     })
// });

// exports.deleteProduct = catchAsync(async(req , res, next) => {
//    const product = await Product.findByIdAndDelete(req.params.id);
//     if(!product){
//     return next(new AppError('No product found with that ID', 404))
//   }
//     res.status(204).json({
//         status :'success',
//         data : null
//     })
// });

// exports.updateProduct = catchAsync(async (req, res, next) => {
//   const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//     new: true, // this will return the new updated document instead of the original one
//     runValidators: true, // this will run the validators on the updated document
//   });
//   if(!product){
//     return next(new AppError('No product found with that ID', 404))
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       product,
//     },
//   });
// });
// exports.getProduct = catchAsync(async(req , res, next) => {
//     const product = await Product.findById(req.params.id);

//     res.status(200).json({
//         status :'success',
//         data : product
//     })
// }); 