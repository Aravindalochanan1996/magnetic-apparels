<template>
  <div class="page">
    <header class="topbar">
      <div class="logo">🧲 Magnetic Apparels</div>
      <nav>
        <button @click="goToDashboard" class="nav-btn">← Continue Shopping</button>
      </nav>
    </header>

    <div class="container">
      <h1>Shopping Cart <span class="count">({{ cartStore.count }} items)</span></h1>

      <div v-if="cartStore.loading" class="loading">Loading cart...</div>
      <div v-else-if="cartStore.items.length === 0" class="empty-cart">
        <div class="empty-icon">🛒</div>
        <p>Your cart is empty</p>
        <button @click="goToDashboard" class="btn-primary">Start Shopping</button>
      </div>

      <div v-else class="cart-layout">
        <div class="cart-items">
          <div class="cart-item" v-for="item in cartStore.items" :key="item.productId">
            <img :src="item.image" :alt="item.title" class="item-img" />
            <div class="item-info">
              <h3>{{ item.title }}</h3>
              <p class="item-meta" v-if="item.size">Size: {{ item.size }} | Color: {{ item.color }}</p>
              <p class="item-price">₹{{ item.price.toLocaleString('en-IN') }}</p>
              <div class="qty-ctrl">
                <button @click="updateQty(item, item.quantity - 1)">−</button>
                <span>{{ item.quantity }}</span>
                <button @click="updateQty(item, item.quantity + 1)">+</button>
              </div>
            </div>
            <div class="item-actions">
              <p class="item-subtotal">₹{{ (item.price * item.quantity).toLocaleString('en-IN') }}</p>
              <button @click="removeItem(item.productId)" class="remove-btn">🗑 Remove</button>
            </div>
          </div>
        </div>

        <div class="order-summary">
          <h2>Order Summary</h2>
          <div class="summary-row">
            <span>Subtotal</span>
            <span>₹{{ cartStore.total.toLocaleString('en-IN') }}</span>
          </div>
          <div class="summary-row discount">
            <span>Discount (10%)</span>
            <span>−₹{{ cartStore.discount.toLocaleString('en-IN') }}</span>
          </div>
          <div class="summary-row">
            <span>Delivery</span>
            <span :class="{ free: cartStore.deliveryCharge === 0 }">
              {{ cartStore.deliveryCharge === 0 ? 'FREE' : `₹${cartStore.deliveryCharge}` }}
            </span>
          </div>
          <div class="summary-total">
            <span>Total</span>
            <span>₹{{ finalAmount.toLocaleString('en-IN') }}</span>
          </div>

          <div class="address-section">
            <h3>📍 Delivery Address</h3>
            <div v-if="selectedAddress" class="selected-addr">
              <p><strong>{{ selectedAddress.fullName }}</strong></p>
              <p>{{ selectedAddress.addressLine1 }}, {{ selectedAddress.city }}</p>
              <p>{{ selectedAddress.state }} - {{ selectedAddress.pincode }}</p>
              <p>📞 {{ selectedAddress.phone }}</p>
            </div>
            <div v-else>
              <form @submit.prevent="saveAddress" class="addr-form">
                <input v-model="addr.fullName" placeholder="Full Name" required />
                <input v-model="addr.phone" placeholder="Phone" required />
                <input v-model="addr.addressLine1" placeholder="Address Line 1" required />
                <input v-model="addr.city" placeholder="City" required />
                <div class="row-2">
                  <input v-model="addr.state" placeholder="State" required />
                  <input v-model="addr.pincode" placeholder="Pincode" required />
                </div>
                <button type="submit" class="btn-outline">Save Address</button>
              </form>
            </div>
          </div>

          <button
            @click="proceedToPayment"
            class="btn-primary"
            :disabled="!selectedAddress || cartStore.items.length === 0"
          >
            Proceed to Payment →
          </button>
          <p class="secure-note">🔒 100% Secure Checkout</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

const router = useRouter();
const cartStore = useCartStore();
const authStore = useAuthStore();

const selectedAddress = ref(authStore.user?.addresses?.find(a => a.isDefault) || null);
const addr = reactive({ fullName: '', phone: '', addressLine1: '', city: '', state: '', pincode: '' });

const finalAmount = computed(() => cartStore.total - cartStore.discount + cartStore.deliveryCharge);

onMounted(() => cartStore.fetchCart());

const updateQty = (item, qty) => {
  if (qty <= 0) removeItem(item.productId);
  else cartStore.updateItem(item.productId, qty);
};

const removeItem = (id) => cartStore.removeItem(id);

const saveAddress = () => {
  selectedAddress.value = { ...addr };
};

const goToDashboard = () => {
  window.location.href = 'http://localhost:3000/dashboard';
};

const proceedToPayment = () => {
  localStorage.setItem('ma_delivery_address', JSON.stringify(selectedAddress.value));
  localStorage.setItem('ma_order_total', JSON.stringify({
    total: cartStore.total,
    discount: cartStore.discount,
    deliveryCharge: cartStore.deliveryCharge,
    finalAmount: finalAmount.value
  }));
  router.push('/payment');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500&display=swap');
* { box-sizing: border-box; }
.page { min-height: 100vh; background: #f8f5ff; font-family: 'DM Sans', sans-serif; }
.topbar { background: #fff; padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
.logo { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #7c4dff; }
.nav-btn { background: none; border: 1px solid #ddd; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
.container { max-width: 1100px; margin: 0 auto; padding: 2rem 1rem; }
h1 { font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 1.5rem; }
.count { font-size: 1.1rem; color: #888; font-family: 'DM Sans', sans-serif; font-weight: 400; }
.loading { text-align: center; padding: 3rem; color: #888; }
.empty-cart { text-align: center; padding: 4rem; }
.empty-icon { font-size: 4rem; }
.empty-cart p { color: #888; margin: 1rem 0; }
.cart-layout { display: grid; grid-template-columns: 1fr 380px; gap: 2rem; }
@media(max-width: 768px) { .cart-layout { grid-template-columns: 1fr; } }
.cart-items { display: flex; flex-direction: column; gap: 1rem; }
.cart-item { background: #fff; border-radius: 14px; padding: 1.25rem; display: flex; gap: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.item-img { width: 90px; height: 90px; object-fit: contain; border-radius: 8px; background: #f5f5f5; }
.item-info { flex: 1; }
.item-info h3 { font-size: 0.95rem; margin: 0 0 0.4rem; color: #222; line-height: 1.4; }
.item-meta { color: #888; font-size: 0.82rem; margin: 0 0 0.4rem; }
.item-price { color: #7c4dff; font-weight: 600; margin: 0 0 0.6rem; }
.qty-ctrl { display: flex; align-items: center; gap: 0.5rem; }
.qty-ctrl button { width: 28px; height: 28px; border-radius: 50%; border: 1px solid #ddd; background: #f5f5f5; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; }
.qty-ctrl span { font-weight: 600; min-width: 1.5rem; text-align: center; }
.item-actions { display: flex; flex-direction: column; align-items: flex-end; justify-content: space-between; }
.item-subtotal { font-weight: 700; color: #333; }
.remove-btn { background: none; border: none; color: #ff4444; cursor: pointer; font-size: 0.82rem; }
.order-summary { background: #fff; border-radius: 14px; padding: 1.5rem; height: fit-content; box-shadow: 0 2px 8px rgba(0,0,0,0.06); position: sticky; top: 1rem; }
.order-summary h2 { font-family: 'Playfair Display', serif; margin: 0 0 1.25rem; }
.summary-row { display: flex; justify-content: space-between; padding: 0.5rem 0; font-size: 0.92rem; color: #555; border-bottom: 1px solid #f5f5f5; }
.summary-row.discount span:last-child { color: #22bb55; }
.free { color: #22bb55; font-weight: 600; }
.summary-total { display: flex; justify-content: space-between; padding: 0.75rem 0; font-weight: 700; font-size: 1.05rem; margin-top: 0.25rem; }
.address-section { margin: 1.5rem 0; }
.address-section h3 { font-size: 0.95rem; margin: 0 0 0.75rem; }
.selected-addr { background: #f5f0ff; border-radius: 10px; padding: 0.75rem; font-size: 0.88rem; color: #444; }
.selected-addr p { margin: 0.2rem 0; }
.addr-form input { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 0.6rem; margin-bottom: 0.5rem; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; outline: none; }
.addr-form input:focus { border-color: #7c4dff; }
.row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
.btn-outline { width: 100%; padding: 0.6rem; border: 2px solid #7c4dff; border-radius: 8px; background: none; color: #7c4dff; font-family: 'DM Sans', sans-serif; font-weight: 600; cursor: pointer; margin-bottom: 0.75rem; }
.btn-primary { width: 100%; padding: 0.875rem; background: linear-gradient(135deg, #b57bee, #7c4dff); border: none; border-radius: 12px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600; cursor: pointer; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.secure-note { text-align: center; font-size: 0.8rem; color: #888; margin-top: 0.75rem; }
</style>
