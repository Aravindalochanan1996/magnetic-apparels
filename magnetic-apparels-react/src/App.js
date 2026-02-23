import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';

// Guard: redirect to Vue login if no token or invalid token
const ProtectedRoute = ({ children }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('ma_token');
      const lastValidation = localStorage.getItem('ma_token_validated');
      const now = Date.now();

      // If validated recently (within 5 minutes), skip API call
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
        // Validate token with API
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
          // Token is invalid, clear it
          localStorage.removeItem('ma_token');
          localStorage.removeItem('ma_user');
          localStorage.removeItem('ma_token_validated');
        }
        // For other errors (429, 500, etc.), don't clear tokens - might be temporary API issues
      } catch (error) {
        // Network error or API unavailable - don't clear tokens, assume they're valid for now
        console.warn('Token validation failed due to network/API error:', error);
        // If we have a cached validation, use it
        if (lastValidation && token) {
          setIsAuthenticated(true);
        } else {
          // Only clear tokens if we have no recent validation
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
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = 'http://localhost:5173/login';
    return null;
  }

  return children;
};

function App() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

export default App;
