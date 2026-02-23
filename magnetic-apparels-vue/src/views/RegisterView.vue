<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="logo">
        <span class="logo-icon">🧲</span>
        <h1>Magnetic Apparels</h1>
      </div>
      <h2>Create Account</h2>
      <p class="subtitle">Join us for exclusive fashion deals</p>

      <form @submit.prevent="handleRegister" novalidate>
        <div class="field" :class="{ error: errors.name }">
          <label>Full Name</label>
          <input v-model.trim="form.name" type="text" placeholder="Ravi Kumar" @blur="validate('name')" />
          <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
        </div>

        <div class="field" :class="{ error: errors.email }">
          <label>Email Address</label>
          <input v-model.trim="form.email" type="email" placeholder="ravi@example.com" @blur="validate('email')" />
          <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
        </div>

        <div class="field" :class="{ error: errors.phone }">
          <label>Phone Number</label>
          <input v-model.trim="form.phone" type="tel" placeholder="9876543210" @blur="validate('phone')" />
          <span v-if="errors.phone" class="error-msg">{{ errors.phone }}</span>
        </div>

        <div class="field" :class="{ error: errors.password }">
          <label>Password</label>
          <div class="input-wrapper">
            <input v-model="form.password" :type="showPwd ? 'text' : 'password'" placeholder="Min 8 chars, A-Z, a-z, 0-9" @blur="validate('password')" />
            <button type="button" class="toggle-pwd" @click="showPwd = !showPwd">{{ showPwd ? '🙈' : '👁' }}</button>
          </div>
          <div class="pwd-strength" v-if="form.password">
            <div class="bar" :class="strengthClass"></div>
            <span>{{ strengthLabel }}</span>
          </div>
          <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
        </div>

        <div class="field" :class="{ error: errors.confirmPassword }">
          <label>Confirm Password</label>
          <input v-model="form.confirmPassword" type="password" placeholder="••••••••" @blur="validate('confirmPassword')" />
          <span v-if="errors.confirmPassword" class="error-msg">{{ errors.confirmPassword }}</span>
        </div>

        <div v-if="authStore.error" class="alert-error">{{ authStore.error }}</div>

        <button type="submit" class="btn-primary" :disabled="authStore.loading">
          <span v-if="authStore.loading">Creating account...</span>
          <span v-else>Create Account</span>
        </button>
      </form>

      <p class="switch-link">Already have an account? <router-link to="/login">Sign in</router-link></p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';

const router = useRouter();
const authStore = useAuthStore();
const showPwd = ref(false);

const form = reactive({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
const errors = reactive({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

const strengthScore = computed(() => {
  const p = form.password;
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
});
const strengthClass = computed(() => ['weak', 'weak', 'fair', 'good', 'strong', 'strong'][strengthScore.value]);
const strengthLabel = computed(() => ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strengthScore.value]);

const validators = {
  name: (v) => !v ? 'Name is required' : v.length < 2 ? 'At least 2 characters' : '',
  email: (v) => !v ? 'Email is required' : !/^\S+@\S+\.\S+$/.test(v) ? 'Invalid email' : '',
  phone: (v) => v && !/^[6-9]\d{9}$/.test(v) ? 'Invalid phone number' : '',
  password: (v) => !v ? 'Password is required' : v.length < 8 ? 'Min 8 characters' : !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(v) ? 'Must include A-Z, a-z, 0-9' : '',
  confirmPassword: (v) => v !== form.password ? 'Passwords do not match' : ''
};

const validate = (field) => { errors[field] = validators[field](form[field]); return !errors[field]; };

const handleRegister = async () => {
  const valid = Object.keys(validators).every(f => validate(f));
  if (!valid) return;

  const result = await authStore.register({
    name: form.name, email: form.email, phone: form.phone, password: form.password
  });

  if (result.success) {
    window.location.href = 'http://localhost:3000/dashboard';
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@400;500&display=swap');
/* Reuse same styles as Login */
.auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #0f0c29, #302b63, #24243e); padding: 1rem; }
.auth-card { background: rgba(255,255,255,0.05); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 2.5rem; width: 100%; max-width: 420px; color: #fff; font-family: 'DM Sans', sans-serif; }
.logo { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem; }
.logo-icon { font-size: 1.8rem; }
.logo h1 { font-family: 'Playfair Display', serif; font-size: 1.4rem; margin: 0; color: #e8c5ff; }
h2 { font-size: 1.8rem; margin: 0; font-family: 'Playfair Display', serif; }
.subtitle { color: rgba(255,255,255,0.5); margin: 0.25rem 0 1.5rem; font-size: 0.9rem; }
.field { margin-bottom: 1rem; }
.field label { display: block; font-size: 0.85rem; color: rgba(255,255,255,0.7); margin-bottom: 0.4rem; font-weight: 500; }
.field input { width: 100%; padding: 0.75rem 1rem; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 0.95rem; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
.field input:focus { border-color: #b57bee; }
.field.error input { border-color: #ff6b6b; }
.error-msg { font-size: 0.78rem; color: #ff8a8a; margin-top: 0.25rem; display: block; }
.input-wrapper { position: relative; }
.input-wrapper input { padding-right: 3rem; }
.toggle-pwd { position: absolute; right: 0.75rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 1rem; }
.pwd-strength { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.4rem; font-size: 0.75rem; color: rgba(255,255,255,0.5); }
.bar { height: 4px; width: 80px; border-radius: 2px; background: #444; }
.bar.weak { background: #ff4444; width: 30px; }
.bar.fair { background: #ffaa00; width: 50px; }
.bar.good { background: #44dd88; width: 65px; }
.bar.strong { background: #00ccff; width: 80px; }
.alert-error { background: rgba(255,107,107,0.15); border: 1px solid rgba(255,107,107,0.3); border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.85rem; color: #ff8a8a; margin-bottom: 1rem; }
.btn-primary { width: 100%; padding: 0.875rem; background: linear-gradient(135deg, #b57bee, #7c4dff); border: none; border-radius: 12px; color: #fff; font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 600; cursor: pointer; transition: opacity 0.2s; margin-top: 0.5rem; }
.btn-primary:hover:not(:disabled) { opacity: 0.9; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.switch-link { text-align: center; margin-top: 1.5rem; font-size: 0.9rem; color: rgba(255,255,255,0.6); }
.switch-link a { color: #b57bee; text-decoration: none; font-weight: 500; }
</style>
