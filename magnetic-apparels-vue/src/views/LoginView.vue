<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="logo">
        <span class="logo-icon">🧲</span>
        <h1>Magnetic Apparels</h1>
      </div>
      <h2>Welcome Back</h2>
      <p class="subtitle">Sign in to your account</p>

      <form @submit.prevent="handleLogin" novalidate>
        <div class="field" :class="{ error: errors.email }">
          <label>Email Address</label>
          <input
            v-model.trim="form.email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            @blur="validateEmail"
          />
          <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
        </div>

        <div class="field" :class="{ error: errors.password }">
          <label>Password</label>
          <div class="input-wrapper">
            <input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
              @blur="validatePassword"
            />
            <button type="button" class="toggle-pwd" @click="showPassword = !showPassword">
              {{ showPassword ? '🙈' : '👁' }}
            </button>
          </div>
          <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
        </div>

        <div v-if="authStore.error" class="alert-error">{{ authStore.error }}</div>

        <button type="submit" class="btn-primary" :disabled="authStore.loading">
          <span v-if="authStore.loading">Signing in...</span>
          <span v-else>Sign In</span>
        </button>
      </form>

      <p class="switch-link">
        Don't have an account?
        <router-link to="/register">Register here</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({ email: '', password: '' });
const errors = reactive({ email: '', password: '' });
const showPassword = ref(false);

const validateEmail = () => {
  if (!form.email) { errors.email = 'Email is required'; return false; }
  if (!/^\S+@\S+\.\S+$/.test(form.email)) { errors.email = 'Invalid email format'; return false; }
  errors.email = ''; return true;
};

const validatePassword = () => {
  if (!form.password) { errors.password = 'Password is required'; return false; }
  errors.password = ''; return true;
};

const handleLogin = async () => {
  const valid = validateEmail() & validatePassword();
  if (!valid) return;

  const result = await authStore.login(form.email, form.password);
  if (result.success) {
    // Navigate to React dashboard
    window.location.href = 'http://localhost:3000';
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500&display=swap');

.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  padding: 1rem;
}

.auth-card {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.logo-icon { font-size: 1.8rem; }
.logo h1 { font-family: 'Playfair Display', serif; font-size: 1.4rem; margin: 0; color: #e8c5ff; }

h2 { font-size: 1.8rem; margin: 0; font-family: 'Playfair Display', serif; }
.subtitle { color: rgba(255,255,255,0.5); margin: 0.25rem 0 1.5rem; font-size: 0.9rem; }

.field { margin-bottom: 1.2rem; }
.field label { display: block; font-size: 0.85rem; color: rgba(255,255,255,0.7); margin-bottom: 0.4rem; font-weight: 500; }

.field input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.field input:focus { border-color: #b57bee; }
.field.error input { border-color: #ff6b6b; }
.error-msg { font-size: 0.78rem; color: #ff8a8a; margin-top: 0.25rem; display: block; }

.input-wrapper { position: relative; }
.input-wrapper input { padding-right: 3rem; }
.toggle-pwd { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 1rem; }

.alert-error {
  background: rgba(255,107,107,0.15);
  border: 1px solid rgba(255,107,107,0.3);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  color: #ff8a8a;
  margin-bottom: 1rem;
}

.btn-primary {
  width: 100%;
  padding: 0.875rem;
  background: linear-gradient(135deg, #b57bee, #7c4dff);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  margin-top: 0.5rem;
}
.btn-primary:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.switch-link { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: rgba(255,255,255,0.6); }
.switch-link a { color: #b57bee; text-decoration: none; font-weight: 500; }
</style>
