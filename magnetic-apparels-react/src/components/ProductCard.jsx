import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const rating = product.rating?.rate || 4;
  const count = product.rating?.count || 100;

  return (
    <div className="meesho-product-card" onClick={() => onAddToCart(product)}>
      <div className="image-container">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="product-info">
        <p className="product-title">{product.title}</p>
        <div className="price-row">
          <span className="current-price">₹{product.price?.toLocaleString('en-IN')}</span>
          <span className="original-price">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
          <span className="discount-percent">{product.discount}% off</span>
        </div>
        <div className="delivery-tag">
          <span>Free Delivery</span>
        </div>
        <div className="rating-row">
          <div className="rating-badge">
            <span>{rating} ★</span>
          </div>
          <span className="rating-count">{count} Reviews</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
