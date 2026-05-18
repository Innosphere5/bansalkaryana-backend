const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../middleware/multer');

// POST /api/products - Create product
router.post('/', upload.single('image'), productController.createProduct);

// GET /api/products - Get all products
router.get('/', productController.getAllProducts);

// PUT /api/products/:id - Update product
router.put('/:id', upload.single('image'), productController.updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', productController.deleteProduct);

module.exports = router;
