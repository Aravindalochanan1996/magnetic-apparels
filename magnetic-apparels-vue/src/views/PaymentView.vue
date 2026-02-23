<template>
  <div class="page">
    <header class="topbar">
      <div class="logo">🧲 Magnetic Apparels</div>
      <button @click="$router.back()" class="nav-btn">← Back to Cart</button>
    </header>

    <div class="container" v-if="!orderPlaced">
      <h1>Secure Payment</h1>
      <div class="checkout-layout">
        <!-- Payment methods -->
        <div class="payment-section">
          <div class="method-tabs">
            <button
              v-for="method in paymentMethods"
              :key="method.key"
              :class="['tab', { active: selected === method.key }]"
              @click="selected = method.key"
            >
              {{ method.icon }} {{ method.label }}
            </button>
          </div>

          <!-- UPI -->
          <div v-if="selected === 'UPI'" class="method-form">
            <label>UPI ID</label>
            <input v-model="upiId" placeholder="yourname@upi" :class="{ error: errors.upi }" />
            <span class="error-msg" v-if="errors.upi">{{ errors.upi }}</span>
          </div>

          <!-- Card -->
          <div v-if="selected === 'CARD'" class="method-form">
            <label>Card Number</label>
            <input v-model="cardNo" placeholder="1234 5678 9012 3456" maxlength="19" @input="formatCard" :class="{ error: errors.card }" />
            <span class="error-msg" v-if="errors.card">{{ errors.card }}</span>
            <div class="row-2">
              <div>
                <label>Expiry</label>
                <input v-model="expiry" placeholder="MM/YY" maxlength="5" @input="formatExpiry" />
              </div>
              <div>
                <label>CVV</label>
                <input v-model="cvv" type="password" placeholder="•••" maxlength="3" />
              </div>
            </div>
            <label>Name on Card</label>
            <input v-model="cardName" placeholder="RAVI KUMAR" style="text-transform:uppercase" />
          </div>

          <!-- Net Banking -->
          <div v-if="selected === 'NET_BANKING'" class="method-form">
            <label>Select Bank</label>
            <select v-model="bank">
              <option value="">-- Select Bank --</option>
              <option v-for="b in banks" :key="b" :value="b">{{ b }}</option>
            </select>
          </div>

          <!-- COD -->
          <div v-if="selected === 'COD'" class="method-form cod-note">
            <div class="cod-icon">💵</div>
            <p>Cash on Delivery – Pay when your order arrives at your doorstep.</p>
            <p class="note">COD available for orders under ₹5,000</p>
          </div>

          <div v-if="errorMsg" class="alert-error">{{ errorMsg }}</div>

          <button @click="handlePayment" class="btn-pay" :disabled="loading">
            <span v-if="loading">Processing...</span>
            <span v-else>Pay ₹{{ finalAmount.toLocaleString('en-IN') }} →</span>
          </button>
        </div>

        <!-- Order summary -->
        <div class="order-summary">
          <h2>Order Summary</h2>
          <div v-for="item in cartItems" :key="item.productId" class="summary-item">
            <img :src="item.image" :alt="item.title" />
            <div>
              <p>{{ item.title }}</p>
              <p class="qty">Qty: {{ item.quantity }}</p>
            </div>
            <span>₹{{ (item.price * item.quantity).toLocaleString('en-IN') }}</span>
          </div>
          <hr />
          <div class="price-row"><span>Subtotal</span><span>₹{{ totals.total?.toLocaleString('en-IN') }}</span></div>
          <div class="price-row discount"><span>Discount</span><span>−₹{{ totals.discount?.toLocaleString('en-IN') }}</span></div>
          <div class="price-row"><span>Delivery</span><span>{{ totals.deliveryCharge === 0 ? 'FREE' : `₹${totals.deliveryCharge}` }}</span></div>
          <div class="price-total"><span>Total</span><span>₹{{ finalAmount.toLocaleString('en-IN') }}</span></div>

          <div class="delivery-addr">
            <h4>📍 Delivery To</h4>
            <p v-if="address"><strong>{{ address.fullName }}</strong> | {{ address.phone }}</p>
            <p v-if="address">{{ address.addressLine1 }}, {{ address.city }}, {{ address.state }} {{ address.pincode }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Success -->
    <div v-else class="success-screen">
      <div class="success-card">
        <div class="success-icon">✅</div>
        <h2>Order Placed Successfully!</h2>
        <p>Order ID: <strong>#{{ orderId }}</strong></p>
        <p>Estimated Delivery: <strong>{{ deliveryDate }}</strong></p>
        <button @click="goHome" class="btn-primary">Continue Shopping</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();

const selected = ref('UPI');
const upiId = ref('');
const cardNo = ref('');
const expiry = ref('');
const cvv = ref('');
const cardName = ref('');
const bank = ref('');
const loading = ref(false);
const errorMsg = ref('');
const errors = ref({ upi: '', card: '' });
const orderPlaced = ref(false);
const orderId = ref('');

const address = ref(JSON.parse(localStorage.getItem('ma_delivery_address') || 'null'));
const totals = ref(JSON.parse(localStorage.getItem('ma_order_total') || '{}'));
const cartItems = computed(() => cartStore.items);
const finalAmount = computed(() => totals.value.finalAmount || 0);
const deliveryDate = computed(() => {
  const d = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);
  return d.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });
});

const paymentMethods = [
  { key: 'UPI', label: 'UPI', icon: '📱' },
  { key: 'CARD', label: 'Card', icon: '💳' },
  { key: 'NET_BANKING', label: 'Net Banking', icon: '🏦' },
  { key: 'COD', label: 'Cash on Delivery', icon: '💵' }
];

const banks = ['SBI', 'HDFC', 'ICICI', 'Axis Bank', 'Kotak', 'Punjab National Bank', 'Bank of Baroda'];

const formatCard = () => {
  cardNo.value = cardNo.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19);
};

const formatExpiry = () => {
  expiry.value = expiry.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').slice(0, 5);
};

const validate = () => {
  errors.value = { upi: '', card: '' };
  if (selected.value === 'UPI') {
    if (!upiId.value || !/^[a-zA-Z0-9.\-_]+@[a-zA-Z]+$/.test(upiId.value)) {
      errors.value.upi = 'Enter a valid UPI ID (eg. name@upi)';
      return false;
    }
  }
  if (selected.value === 'CARD') {
    if (cardNo.value.replace(/\s/g, '').length < 16) {
      errors.value.card = 'Enter a valid 16-digit card number';
      return false;
    }
  }
  return true;
};

const handlePayment = async () => {
  if (!validate()) return;
  loading.value = true;
  errorMsg.value = '';

  try {
    const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const token = authStore.token;

    const { data } = await axios.post(`${API}/orders`, {
      items: cartStore.items,
      deliveryAddress: address.value,
      paymentMethod: selected.value,
      totalAmount: totals.value.total,
      discount: totals.value.discount,
      deliveryCharge: totals.value.deliveryCharge
    }, { headers: { Authorization: `Bearer ${token}` } });

    orderId.value = data.order._id;
    orderPlaced.value = true;
    await cartStore.fetchCart();
  } catch (err) {
    errorMsg.value = err.response?.data?.error || 'Payment failed. Please try again.';
  } finally {
    loading.value = false;
  }
};

const goHome = () => { window.location.href = 'http://localhost:3000/dashboard'; };

onMounted(() => cartStore.fetchCart());
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500&display=swap');
* { box-sizing: border-box; }
.page { min-height: 100vh; background: #f8f5ff; font-family: 'DM Sans', sans-serif; }
.topbar { background: #fff; padding: 1rem 2rem; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
.logo { font-family: 'Playfair Display', serif; font-size: 1.3rem; color: #7c4dff; }
.nav-btn { background: none; border: 1px solid #ddd; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; }
.container { max-width: 1100px; margin: 0 auto; padding: 2rem 1rem; }
h1 { font-family: 'Playfair Display', serif; font-size: 2rem; margin-bottom: 1.5rem; }
.checkout-layout { display: grid; grid-template-columns: 1fr 380px; gap: 2rem; }
@media(max-width: 768px) { .checkout-layout { grid-template-columns: 1fr; } }
.payment-section { background: #fff; border-radius: 14px; padding: 1.75rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.method-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
.tab { padding: 0.5rem 0.875rem; border: 2px solid #ddd; border-radius: 8px; background: none; cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 0.85rem; transition: all 0.2s; }
.tab.active { border-color: #7c4dff; color: #7c4dff; background: #f5f0ff; font-weight: 600; }
.method-form label { display: block; font-size: 0.85rem; color: #666; margin-bottom: 0.3rem; font-weight: 500; }
.method-form input, .method-form select { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 0.7rem; margin-bottom: 1rem; font-family: 'DM Sans', sans-serif; font-size: 0.93rem; outline: none; }
.method-form input:focus, .method-form select:focus { border-color: #7c4dff; }
.method-form input.error { border-color: #ff4444; }
.error-msg { font-size: 0.78rem; color: #ff4444; margin-top: -0.75rem; margin-bottom: 0.75rem; display: block; }
.row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
.cod-note { text-align: center; padding: 1.5rem 0; }
.cod-icon { font-size: 3rem; margin-bottom: 0.75rem; }
.cod-note p { color: #444; margin: 0.25rem 0; }
.cod-note .note { font-size: 0.8rem; color: #888; }
.alert-error { background: #fff0f0; border: 1px solid #ffcccc; border-radius: 8px; padding: 0.75rem; color: #cc0000; font-size: 0.85rem; margin-bottom: 1rem; }
.btn-pay { width: 100%; padding: 0.9rem; background: linear-gradient(135deg, #22bb55, #00aa44); border: none; border-radius: 12px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 1.05rem; font-weight: 700; cursor: pointer; margin-top: 0.5rem; transition: opacity 0.2s; }
.btn-pay:hover:not(:disabled) { opacity: 0.9; }
.btn-pay:disabled { opacity: 0.5; cursor: not-allowed; }
.order-summary { background: #fff; border-radius: 14px; padding: 1.5rem; height: fit-content; box-shadow: 0 2px 8px rgba(0,0,0,0.06); position: sticky; top: 1rem; }
.order-summary h2 { font-family: 'Playfair Display', serif; margin: 0 0 1rem; }
.summary-item { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
.summary-item img { width: 50px; height: 50px; object-fit: contain; border-radius: 6px; background: #f5f5f5; }
.summary-item div { flex: 1; font-size: 0.85rem; }
.summary-item div p { margin: 0; }
.summary-item div .qty { color: #888; font-size: 0.78rem; }
.summary-item span { font-weight: 600; font-size: 0.9rem; }
hr { border: none; border-top: 1px solid #eee; margin: 0.75rem 0; }
.price-row { display: flex; justify-content: space-between; font-size: 0.88rem; padding: 0.3rem 0; color: #555; }
.price-row.discount span:last-child { color: #22bb55; }
.price-total { display: flex; justify-content: space-between; font-weight: 700; font-size: 1rem; padding: 0.5rem 0; }
.delivery-addr { background: #f5f0ff; border-radius: 10px; padding: 0.75rem; margin-top: 1rem; font-size: 0.85rem; }
.delivery-addr h4 { margin: 0 0 0.4rem; font-size: 0.88rem; }
.delivery-addr p { margin: 0.15rem 0; color: #555; }
.success-screen { min-height: calc(100vh - 60px); display: flex; align-items: center; justify-content: center; padding: 2rem; }
.success-card { background: #fff; border-radius: 20px; padding: 3rem; text-align: center; max-width: 480px; width: 100%; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
.success-icon { font-size: 4rem; margin-bottom: 1rem; }
.success-card h2 { font-family: 'Playfair Display', serif; margin-bottom: 1rem; }
.success-card p { color: #555; margin: 0.4rem 0; }
.btn-primary { margin-top: 1.5rem; padding: 0.875rem 2rem; background: linear-gradient(135deg, #b57bee, #7c4dff); border: none; border-radius: 12px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600; cursor: pointer; }
</style>
