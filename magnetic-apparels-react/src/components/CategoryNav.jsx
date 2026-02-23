import React from 'react';
import './CategoryNav.css';

const CATEGORIES = [
  { id: 'women-ethnic', label: 'Women Ethnic' },
  { id: 'women-western', label: 'Women Western' },
  { id: 'men', label: 'Men' },
  { id: 'kids', label: 'Kids' },
  { id: 'home-kitchen', label: 'Home & Kitchen' },
  { id: 'beauty-health', label: 'Beauty & Health' },
  { id: 'jewellery-accessories', label: 'Jewellery & Accessories' },
  { id: 'bags-footwear', label: 'Bags & Footwear' },
  { id: 'electronics', label: 'Electronics' }
];

const CategoryNav = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className="category-nav">
      <div className="nav-container">
        {CATEGORIES.map(cat => (
          <div
            key={cat.id}
            className={`nav-item ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat.id)}
          >
            {cat.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
