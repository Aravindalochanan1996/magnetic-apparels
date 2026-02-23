import React from 'react';
import { Link } from 'react-router-dom';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const lastOrder = JSON.parse(localStorage.getItem('ma_last_order') || '{}');

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for shopping with Magnetic Apparels.</p>

        <div className="order-info">
          <p>Order ID: <strong>{lastOrder._id || lastOrder.id || 'N/A'}</strong></p>
          <p>Total Amount: <strong>₹{lastOrder.totalAmount?.toLocaleString('en-IN') || '0'}</strong></p>
        </div>

        <div className="actions">
          <Link to="/" className="btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
