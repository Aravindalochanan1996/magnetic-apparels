import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store/authStore';

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/cart',
    component: () => import('../views/CartView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/payment',
    component: () => import('../views/PaymentView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order-success',
    component: () => import('../views/OrderSuccessView.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // Initialize auth state if not done yet
  if (!auth.initialized) {
    await auth.initializeAuth();
  }

  if (to.meta.requiresAuth && !auth.token) {
    return next('/login');
  }

  // Remove automatic redirect for guest routes - let users access login/register even if authenticated
  // The redirect to dashboard will happen after successful login instead

  next();
});

export default router;
