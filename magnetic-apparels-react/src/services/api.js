import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_BASE });

// Attach token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ma_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ma_token');
      localStorage.removeItem('ma_user');
      localStorage.removeItem('ma_token_validated');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const productService = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getCategories: () => api.get('/products/categories')
};

export const cartService = {
  get: () => api.get('/cart'),
  add: (item) => api.post('/cart', item),
  update: (productId, quantity) => api.put(`/cart/${productId}`, { quantity }),
  remove: (productId) => api.delete(`/cart/${productId}`)
};

export const orderService = {
  create: (data) => api.post('/orders', data),
  getMine: () => api.get('/orders/me'),
  getById: (id) => api.get(`/orders/${id}`)
};

export default api;
