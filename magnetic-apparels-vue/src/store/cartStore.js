import { defineStore } from 'pinia';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    total: 0,
    count: 0,
    loading: false,
    error: null
  }),
  getters: {
    deliveryCharge: (state) => state.total > 999 ? 0 : 49,
    discount: (state) => Math.round(state.total * 0.1),
    finalAmount: (state) => {
      const s = useCartStore();
      return state.total - s.discount + s.deliveryCharge;
    }
  },
  actions: {
    async fetchCart() {
      this.loading = true;
      try {
        const { data } = await axios.get(`${API}/cart`);
        this.items = data.items;
        this.total = data.total;
        this.count = data.count;
      } catch (err) {
        this.error = 'Failed to load cart.';
      } finally {
        this.loading = false;
      }
    },

    async updateItem(productId, quantity) {
      try {
        const { data } = await axios.put(`${API}/cart/${productId}`, { quantity });
        this.items = data.items;
        this.total = data.total;
        this.count = data.count;
      } catch (err) {
        this.error = 'Failed to update item.';
      }
    },

    async removeItem(productId) {
      try {
        const { data } = await axios.delete(`${API}/cart/${productId}`);
        this.items = data.items;
        this.total = data.total;
        this.count = data.count;
      } catch (err) {
        this.error = 'Failed to remove item.';
      }
    }
  }
});
