const Product = require('./../models/product');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const multer = require('multer');



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
  const timestamp = Date.now();

  // Handle imageCover if present
  if (req.files.imageCover) {
    req.body.imageCover = `product-${timestamp}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(800, 800)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/products/${req.body.imageCover}`);
  }

  // Handle images if present
  if (req.files.images) {
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
  }

  next();
};

exports.getAllProducts = factory.getAllOne(Product);
exports.createProduct = factory.createOne(Product);
exports.deleteProduct = factory.deleteOne(Product);
exports.updateProduct = factory.updateOne(Product);
exports.getProduct = factory.getOne(Product);

