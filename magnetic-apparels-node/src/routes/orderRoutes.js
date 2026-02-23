const express = require('express');
const { placeOrder, getMyOrders, getOrder } = require('../controllers/orderController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.post('/', placeOrder);
router.get('/', getMyOrders);
router.get('/:id', getOrder);

module.exports = router;
