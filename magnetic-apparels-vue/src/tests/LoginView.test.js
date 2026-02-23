import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';

// Mock auth store
vi.mock('../store/authStore', () => ({
  useAuthStore: () => ({
    loading: false,
    error: null,
    login: vi.fn().mockResolvedValue({ success: true })
  })
}));

const router = createRouter({ history: createMemoryHistory(), routes: [
  { path: '/login', component: LoginView },
  { path: '/register', component: { template: '<div/>' } }
]});

describe('LoginView', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('renders login form', async () => {
    const wrapper = mount(LoginView, { global: { plugins: [createPinia(), router] } });
    expect(wrapper.find('h2').text()).toBe('Welcome Back');
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
  });

  it('shows validation errors for empty submit', async () => {
    const wrapper = mount(LoginView, { global: { plugins: [createPinia(), router] } });
    await wrapper.find('form').trigger('submit');
    expect(wrapper.html()).toContain('Email is required');
  });

  it('shows error for invalid email', async () => {
    const wrapper = mount(LoginView, { global: { plugins: [createPinia(), router] } });
    await wrapper.find('input[type="email"]').setValue('bad-email');
    await wrapper.find('input[type="email"]').trigger('blur');
    expect(wrapper.html()).toContain('Invalid email format');
  });

  it('has a link to register page', () => {
    const wrapper = mount(LoginView, { global: { plugins: [createPinia(), router] } });
    expect(wrapper.find('a').attributes('href')).toContain('register');
  });
});
