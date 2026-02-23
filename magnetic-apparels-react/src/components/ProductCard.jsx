import React, { useState } from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  const [added, setAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState('M');

  const handleAdd = () => {
    onAddToCart({ ...product, size: selectedSize });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const categoryIcons = {
    dresses: '👗', shoes: '👟', watches: '⌚', wallets: '👜'
  };

  return (
    <div className="product-card">
      <div className="card-badge">{product.discount}% OFF</div>
      <div className="card-category">{categoryIcons[product.appCategory]} {product.appCategory}</div>
      <div className="card-img-wrap">
        <img src={product.image} alt={product.title} loading="lazy" />
      </div>
      <div className="card-body">
        <h3 className="card-title">{product.title}</h3>
        <div className="card-rating">
          {'★'.repeat(Math.round(product.rating?.rate || 4))}
          {'☆'.repeat(5 - Math.round(product.rating?.rate || 4))}
          <span>({product.rating?.count})</span>
        </div>
        <div className="card-price">
          <span className="price-now">₹{product.price?.toLocaleString('en-IN')}</span>
          <span className="price-old">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
        </div>
        <div className="size-picker">
          {(product.sizes || ['S', 'M', 'L', 'XL']).map(s => (
            <button
              key={s}
              className={`size-btn ${selectedSize === s ? 'active' : ''}`}
              onClick={() => setSelectedSize(s)}
            >{s}</button>
          ))}
        </div>
        <p className="delivery-info">🚚 {product.deliveryIn} delivery</p>
        <button
          className={`btn-add ${added ? 'added' : ''}`}
          onClick={handleAdd}
        >
          {added ? '✓ Added to Cart' : '+ Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
