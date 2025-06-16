const express = require('express');
const router = express.Router();
const productController = require('./../controllers/productController');

router.get('/' ,productController.getAllProducts);
router.post('/create-product',productController.createProduct);
router.delete('/:id',productController.deleteProduct);
router.get('/:id',productController.getProduct);
router.patch('/:id',productController.updateProduct);

module.exports = router;