import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/api';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const summary = JSON.parse(localStorage.getItem('ma_order_total') || '{}');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        shippingAddress: address,
        paymentMethod: 'COD',
        totalAmount: summary.finalAmount
      };
      const { data } = await orderService.create(orderData);
      localStorage.setItem('ma_last_order', JSON.stringify(data));
      navigate('/order-success');
    } catch (err) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Checkout</h1>

        <div className="payment-layout">
          <div className="address-form">
            <h2>Delivery Address</h2>
            <form onSubmit={handlePlaceOrder}>
              <div className="form-group">
                <input name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <input name="phone" placeholder="Phone Number" value={address.phone} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <input name="addressLine1" placeholder="Address (House No, Building, Street)" value={address.addressLine1} onChange={handleInputChange} required />
              </div>
              <div className="form-row">
                <input name="city" placeholder="City" value={address.city} onChange={handleInputChange} required />
                <input name="pincode" placeholder="Pincode" value={address.pincode} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <input name="state" placeholder="State" value={address.state} onChange={handleInputChange} required />
              </div>

              <div className="payment-method">
                <h2>Payment Method</h2>
                <div className="radio-group">
                  <label>
                    <input type="radio" name="payment" value="COD" checked readOnly />
                    Cash on Delivery (COD)
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Processing...' : `Pay ₹${summary.finalAmount?.toLocaleString('en-IN')}`}
              </button>
            </form>
          </div>

          <div className="payment-summary">
            <h2>Price Details</h2>
            <div className="summary-row">
              <span>Total Product Price</span>
              <span>₹{summary.total?.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row discount">
              <span>Product Discount</span>
              <span>−₹{summary.discount?.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>{summary.deliveryCharge === 0 ? 'FREE' : `₹${summary.deliveryCharge}`}</span>
            </div>
            <div className="summary-total">
              <span>Order Total</span>
              <span>₹{summary.finalAmount?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
