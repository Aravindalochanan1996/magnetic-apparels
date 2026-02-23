import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../hooks/useProducts';
import { cartService } from '../services/api';
import './Dashboard.css';

const CATEGORIES = [
  { key: '', label: 'All', icon: '🛍' },
  { key: 'dresses', label: 'Dresses', icon: '👗' },
  { key: 'shoes', label: 'Shoes', icon: '👟' },
  { key: 'watches', label: 'Watches', icon: '⌚' },
  { key: 'wallets', label: 'Wallets', icon: '👜' }
];

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('ma_user') || '{}');
  const [cartCount, setCartCount] = useState(0);
  const [toastMsg, setToastMsg] = useState('');

  const {
    products, loading, error,
    category, setCategory,
    sort, setSort,
    page, setPage, totalPages,
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
        productId: String(product.id),
        title: product.title,
        image: product.image,
        price: product.price,
        quantity: 1,
        size: product.size,
        color: product.colors?.[0] || 'Default'
      });
      setCartCount(data.count);
      showToast(`"${product.title.slice(0, 30)}..." added to cart!`);
    } catch {
      showToast('Failed to add to cart. Please try again.', true);
    }
  };

  const showToast = (msg, isError = false) => {
    setToastMsg({ msg, isError });
    setTimeout(() => setToastMsg(''), 3000);
  };

  const goToCart = () => { window.location.href = 'http://localhost:5173/cart'; };

  const logout = () => {
    localStorage.removeItem('ma_token');
    localStorage.removeItem('ma_user');
    window.location.href = 'http://localhost:5173/login';
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo">🧲 Magnetic Apparels</div>
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Search dresses, shoes, watches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="header-right">
          <span className="user-greeting">Hi, {user.name?.split(' ')[0] || 'User'} 👋</span>
          <button className="cart-btn" onClick={goToCart}>
            🛒 Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <p className="hero-tag">New Collection</p>
          <h1>Dress to Impress.<br />Style Starts Here.</h1>
          <p>Free delivery on orders above ₹999</p>
        </div>
        <div className="hero-emojis">👗 👟 ⌚ 👜</div>
      </div>

      <div className="main-content">
        {/* Filters */}
        <aside className="sidebar">
          <h3>Categories</h3>
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              className={`cat-btn ${category === c.key ? 'active' : ''}`}
              onClick={() => { setCategory(c.key); setPage(1); }}
            >
              {c.icon} {c.label}
            </button>
          ))}

          <h3 style={{ marginTop: '1.5rem' }}>Sort By</h3>
          {[
            { value: '', label: 'Relevance' },
            { value: 'price_asc', label: 'Price: Low to High' },
            { value: 'price_desc', label: 'Price: High to Low' },
            { value: 'rating', label: 'Top Rated' }
          ].map(s => (
            <button
              key={s.value}
              className={`cat-btn ${sort === s.value ? 'active' : ''}`}
              onClick={() => setSort(s.value)}
            >
              {s.label}
            </button>
          ))}
        </aside>

        {/* Products Grid */}
        <div className="products-area">
          <div className="products-header">
            <p>{products.length} Products</p>
          </div>

          {loading && (
            <div className="loading-grid">
              {Array(8).fill(0).map((_, i) => (
                <div className="skeleton-card" key={i}>
                  <div className="skeleton-img" />
                  <div className="skeleton-line" />
                  <div className="skeleton-line short" />
                </div>
              ))}
            </div>
          )}

          {error && <div className="error-msg">⚠️ {error}</div>}

          {!loading && !error && (
            <>
              <div className="products-grid">
                {products.map(p => (
                  <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
                ))}
              </div>

              {products.length === 0 && (
                <div className="no-results">
                  <p>🔍 No products found</p>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                    <button key={n} className={page === n ? 'active' : ''} onClick={() => setPage(n)}>{n}</button>
                  ))}
                  <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Toast */}
      {toastMsg && (
        <div className={`toast ${toastMsg.isError ? 'toast-error' : ''}`}>
          {toastMsg.msg}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
