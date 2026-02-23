import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import OrderSuccess from './pages/OrderSuccess';

const ProtectedRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('ma_token');
      const lastValidation = localStorage.getItem('ma_token_validated');
      const now = Date.now();

      if (lastValidation && token && (now - parseInt(lastValidation)) < 5 * 60 * 1000) {
        setIsAuthenticated(true);
        setIsValidating(false);
        return;
      }

      if (!token) {
        setIsValidating(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
          localStorage.setItem('ma_token_validated', now.toString());
        } else if (response.status === 401) {
          localStorage.removeItem('ma_token');
          localStorage.removeItem('ma_user');
          localStorage.removeItem('ma_token_validated');
        }
      } catch (error) {
        console.warn('Token validation failed:', error);
        if (lastValidation && token) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('ma_token');
          localStorage.removeItem('ma_user');
          localStorage.removeItem('ma_token_validated');
        }
      }
      setIsValidating(false);
    };

    validateToken();
  }, []);

  if (isValidating) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        } />
        <Route path="/order-success" element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        } />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
