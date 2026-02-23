<template>
  <div class="page">
    <header class="topbar">
      <div class="logo">🧲 Magnetic Apparels</div>
      <nav>
        <button @click="goToDashboard" class="nav-btn">← Continue Shopping</button>
      </nav>
    </header>

    <div class="container">
      <div class="success-content">
        <div class="success-icon">✅</div>
        <h1>Order Placed Successfully!</h1>
        <p class="success-message">
          Thank you for your purchase. Your order has been confirmed and will be processed shortly.
        </p>
        <div class="order-details">
          <p>You will receive an email confirmation with your order details.</p>
        </div>
        <div class="actions">
          <button @click="goToDashboard" class="btn-primary">Continue Shopping</button>
          <button @click="goToOrders" class="btn-secondary">View My Orders</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderSuccessView',
  methods: {
    goToDashboard() {
      this.$router.push('/');
    },
    goToOrders() {
      // Assuming there's an orders route, or redirect to dashboard for now
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f8f9fa;
}

.topbar {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.nav-btn {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.nav-btn:hover {
  background: #f8f9fa;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.success-content {
  background: white;
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

h1 {
  color: #28a745;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.success-message {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.order-details {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 6px;
  margin-bottom: 2rem;
}

.order-details p {
  color: #555;
  margin: 0;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background: #545b62;
}

@media (max-width: 768px) {
  .actions {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 300px;
  }
}
</style>