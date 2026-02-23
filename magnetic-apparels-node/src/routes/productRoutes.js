const express = require('express');
const { getAllProducts, getProduct, getCategories } = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/categories', getCategories);
router.get('/', authenticate, getAllProducts);
router.get('/:id', authenticate, getProduct);

module.exports = router;
