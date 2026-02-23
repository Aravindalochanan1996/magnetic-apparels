import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { cartService } from '../services/api';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await cartService.get();
      setItems(data.items);
      setTotal(data.total);
      setCount(data.count);
    } catch (err) {
      console.error('Failed to load cart', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    try {
      const { data } = await cartService.update(productId, quantity);
      setItems(data.items);
      setTotal(data.total);
      setCount(data.count);
    } catch (err) {
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      const { data } = await cartService.remove(productId);
      setItems(data.items);
      setTotal(data.total);
      setCount(data.count);
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const deliveryCharge = total > 999 ? 0 : 49;
  const discount = Math.round(total * 0.1);
  const finalAmount = total - discount + deliveryCharge;

  const proceedToCheckout = () => {
    localStorage.setItem('ma_order_total', JSON.stringify({
      total, discount, deliveryCharge, finalAmount
    }));
    navigate('/payment');
  };

  if (loading) return <div className="cart-loading">Loading your cart...</div>;

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Shopping Cart ({count} items)</h1>

        {items.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {items.map(item => (
                <div key={item.productId} className="cart-item">
                  <img src={item.image} alt={item.title} />
                  <div className="item-details">
                    <h3>{item.title}</h3>
                    <p className="item-meta">Size: {item.size} | Color: {item.color}</p>
                    <p className="item-price">₹{item.price.toLocaleString('en-IN')}</p>
                    <div className="qty-control">
                      <button onClick={() => updateQty(item.productId, item.quantity - 1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQty(item.productId, item.quantity + 1)}>+</button>
                    </div>
                  </div>
                  <div className="item-actions">
                    <p className="item-subtotal">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    <button className="remove-btn" onClick={() => removeItem(item.productId)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row discount">
                <span>Discount (10%)</span>
                <span>−₹{discount.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charge</span>
                <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
              </div>
              <div className="summary-total">
                <span>Total Amount</span>
                <span>₹{finalAmount.toLocaleString('en-IN')}</span>
              </div>
              <button className="btn-primary" onClick={proceedToCheckout}>Proceed to Payment</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
