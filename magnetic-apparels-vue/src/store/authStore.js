import { defineStore } from 'pinia';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    loading: false,
    error: null,
    initialized: false,
    initializing: false,
    lastValidation: null
  }),
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  actions: {
    async initializeAuth() {
      if (this.initialized || this.initializing) return;

      // If validated recently (within 5 minutes), skip API call
      const now = Date.now();
      if (this.lastValidation && (now - this.lastValidation) < 5 * 60 * 1000) {
        this.initialized = true;
        return;
      }

      this.initializing = true;

      const token = localStorage.getItem('ma_token');
      const user = localStorage.getItem('ma_user');

      if (token && user) {
        try {
          // Validate token with API
          const { data } = await axios.get(`${API}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          this.token = token;
          this.user = JSON.parse(user);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          this.lastValidation = now;
        } catch (err) {
          // Only clear token on 401 (unauthorized), not on other errors
          if (err.response?.status === 401) {
            this.logout();
          }
          // For network errors, rate limiting, or other API issues, keep the token
          // The token might still be valid, just API temporarily unavailable
        }
      }

      this.initialized = true;
      this.initializing = false;
    },

    async register(payload) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.post(`${API}/auth/register`, payload);
        this._setSession(data);
        return { success: true };
      } catch (err) {
        this.error = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Registration failed';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async login(email, password) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await axios.post(`${API}/auth/login`, { email, password });
        this._setSession(data);
        return { success: true };
      } catch (err) {
        this.error = err.response?.data?.error || 'Login failed';
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.initialized = false;
      this.initializing = false;
      this.lastValidation = null;
      localStorage.removeItem('ma_token');
      localStorage.removeItem('ma_user');
      delete axios.defaults.headers.common['Authorization'];
    },

    _setSession({ token, user }) {
      this.token = token;
      this.user = user;
      localStorage.setItem('ma_token', token);
      localStorage.setItem('ma_user', JSON.stringify(user));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }
});
