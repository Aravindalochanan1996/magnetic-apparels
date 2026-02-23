import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { cartService } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [cartCount, setCartCount] = useState(0);
  const {
    products, loading, error,
    category, setCategory,
    sort, setSort,
    searchQuery, setSearchQuery
  } = useProducts();

  useEffect(() => {
    cartService.get()
      .then(({ data }) => setCartCount(data.count))
      .catch(() => {});
  }, []);

  const handleAddToCart = async (product) => {
    try {
      const { data } = await cartService.add({
        productId: String(product.id || product._id),
        title: product.title,
        image: product.image,
        price: product.price,
        quantity: 1,
        size: 'M',
        color: 'Default'
      });
      setCartCount(data.count);
    } catch {
      alert('Failed to add to cart');
    }
  };

  return (
    <div className="meesho-dashboard">
      <Header
        cartCount={cartCount}
        onSearch={setSearchQuery}
        initialSearch={searchQuery}
      />
      <CategoryNav
        activeCategory={category}
        onCategoryChange={setCategory}
      />

      <main className="dashboard-content">
        {/* Promotional Banner */}
        <div className="promo-banner">
          <div className="banner-content">
            <h1>Lowest Prices Best Quality Shopping</h1>
            <div className="banner-features">
              <div className="feature">🚚 Free Delivery</div>
              <div className="feature">💰 Cash on Delivery</div>
              <div className="feature">🔄 Easy Returns</div>
            </div>
            <button className="download-btn">Download the Meesho App</button>
          </div>
          <div className="banner-image">
             <img src="https://images.meesho.com/images/pow/banner_desktop.webp" alt="Promo" onError={(e) => e.target.style.display='none'} />
          </div>
        </div>

        <div className="main-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <div className="filter-group">
              <h3>Sort By</h3>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="">Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div className="filter-group">
              <h3>Category</h3>
              <div className="filter-options">
                {['Dresses', 'Shoes', 'Watches', 'Wallets'].map(cat => (
                  <label key={cat}>
                    <input
                      type="checkbox"
                      checked={category === cat.toLowerCase()}
                      onChange={() => setCategory(category === cat.toLowerCase() ? '' : cat.toLowerCase())}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div className="products-section">
            <h2>Products For You</h2>

            {loading && <div className="loading">Loading products...</div>}
            {error && <div className="error">{error}</div>}

            <div className="products-grid">
              {products.map(p => (
                <ProductCard key={p.id || p._id} product={p} onAddToCart={handleAddToCart} />
              ))}
            </div>

            {!loading && products.length === 0 && (
              <div className="no-products">No products found matching your search.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
