const express = require('express');
const router = express.Router();
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController'); // assuming you have auth

// Protect these routes
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

// Upload images during creation
router.post(
  '/create-product',
  productController.uploadProductImages,
  productController.resizeProductImages,
  productController.createProduct
);

// Upload images during update (optional)
router.patch(
  '/:id',
  productController.uploadProductImages,
  productController.resizeProductImages,
  productController.updateProduct
);

// Read-only public access
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
