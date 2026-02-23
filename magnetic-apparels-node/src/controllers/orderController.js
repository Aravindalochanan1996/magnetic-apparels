const Order = require('../models/Order');
const { clearCart } = require('./cartController');
const logger = require('../config/logger');

// POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, totalAmount, discount = 0, deliveryCharge = 0 } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    const finalAmount = totalAmount - discount + deliveryCharge;
    const estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // +5 days

    const order = await Order.create({
      user: req.user._id,
      items,
      deliveryAddress,
      totalAmount,
      discount,
      deliveryCharge,
      finalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'COMPLETED',
      transactionId: `TXN${Date.now()}`,
      estimatedDelivery
    });

    // Clear cart after order placed
    clearCart(req.user._id.toString());

    logger.info(`Order placed: ${order._id} by user ${req.user._id}`);
    res.status(201).json({ order, message: 'Order placed successfully!' });
  } catch (err) {
    logger.error('Order error:', err.message);
    res.status(500).json({ error: 'Failed to place order.' });
  }
};

// GET /api/orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
};

// GET /api/orders/:id
const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch order.' });
  }
};

module.exports = { placeOrder, getMyOrders, getOrder };
