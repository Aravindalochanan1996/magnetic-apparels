import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';

const Header = ({ cartCount, onSearch, initialSearch = '' }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState(initialSearch);
  const user = JSON.parse(localStorage.getItem('ma_user') || '{}');

  const handleSearch = (e) => {
    setSearch(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const logout = () => {
    localStorage.removeItem('ma_token');
    localStorage.removeItem('ma_user');
    localStorage.removeItem('ma_token_validated');
    navigate('/login');
  };

  return (
    <header className="meesho-header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo">
            <span className="logo-text">Magnetic Apparels</span>
          </Link>
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Try Saree, Kurti or Search by Product Code"
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="header-right">
          <div className="header-item download">
             <span>Download App</span>
          </div>
          <div className="header-item supplier">
             <span>Become a Supplier</span>
          </div>
          <div className="header-item profile">
             <span className="icon">👤</span>
             <span>{user.name?.split(' ')[0] || 'Profile'}</span>
             <div className="profile-dropdown">
                <div className="dropdown-user">
                  <p><strong>Hello {user.name || 'User'}</strong></p>
                  <p className="small">{user.email}</p>
                </div>
                <hr />
                <button className="logout-btn" onClick={logout}>Logout</button>
             </div>
          </div>
          <Link to="/cart" className="header-item cart">
             <span className="icon">🛒</span>
             <span>Cart</span>
             {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
