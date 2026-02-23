// Cart is stored server-side per user session
// In production, use Redis for performance

const carts = new Map(); // userId -> cart items (in-memory, replace with Redis)

const getCart = (req, res) => {
  const cart = carts.get(req.user._id.toString()) || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ items: cart, total, count: cart.length });
};

const addToCart = (req, res) => {
  const { productId, title, image, price, quantity = 1, size, color } = req.body;

  if (!productId || !title || !price) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const userId = req.user._id.toString();
  const cart = carts.get(userId) || [];
  const existingIdx = cart.findIndex(i => i.productId === productId && i.size === size);

  if (existingIdx >= 0) {
    cart[existingIdx].quantity += quantity;
  } else {
    cart.push({ productId, title, image, price, quantity, size, color });
  }

  carts.set(userId, cart);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ items: cart, total, count: cart.length });
};

const updateCartItem = (req, res) => {
  const { quantity } = req.body;
  const userId = req.user._id.toString();
  const cart = carts.get(userId) || [];
  const idx = cart.findIndex(i => i.productId === req.params.productId);

  if (idx === -1) return res.status(404).json({ error: 'Item not in cart.' });

  if (quantity <= 0) {
    cart.splice(idx, 1);
  } else {
    cart[idx].quantity = quantity;
  }

  carts.set(userId, cart);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ items: cart, total, count: cart.length });
};

const removeFromCart = (req, res) => {
  const userId = req.user._id.toString();
  const cart = (carts.get(userId) || []).filter(i => i.productId !== req.params.productId);
  carts.set(userId, cart);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ items: cart, total, count: cart.length });
};

const clearCart = (userId) => carts.delete(userId);

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
