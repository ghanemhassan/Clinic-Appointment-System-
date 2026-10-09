/**
 * Authentication Store & State Management
 */
import { api } from './api.js';
import { t } from '../utils/i18n.js';

class AuthStore {
  constructor() {
    this.user = null;
    this.token = localStorage.getItem('token') || null;
    this.listeners = [];

    // Listen to 401 unauthorized events
    window.addEventListener('auth:unauthorized', () => {
      this.logout(false);
    });
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => {
      try {
        listener({
          user: this.user,
          token: this.token,
          isAuthenticated: !!this.token && !!this.user,
          role: this.user?.role || null,
        });
      } catch (err) {
        console.error('Error in auth listener:', err);
      }
    });
  }

  async init() {
    if (!this.token) {
      this.user = null;
      this.notify();
      return null;
    }

    try {
      const response = await api.getMe();
      if (response && response.success && response.data) {
        this.user = response.data;
        this.notify();
        return this.user;
      } else {
        this.logout(false);
        return null;
      }
    } catch (error) {
      console.warn('Failed to verify token:', error.message);
      this.logout(false);
      return null;
    }
  }

  async login(email, password) {
    const response = await api.login(email, password);
    const token = response.data?.token || response.token;
    const user = response.data?.user || response.user;

    if (response.success && token) {
      this.token = token;
      this.user = user;
      api.setToken(this.token);
      this.notify();
      return { success: true, token, user, message: response.message };
    }
    throw new Error(response.message || t('auth_login_failed'));
  }

  async register(userData) {
    const response = await api.register(userData);
    const token = response.data?.token || response.token;
    const user = response.data?.user || response.user;

    if (response.success && token) {
      this.token = token;
      this.user = user;
      api.setToken(this.token);
      this.notify();
      return { success: true, token, user, message: response.message };
    }
    throw new Error(response.message || t('auth_register_failed'));
  }

  logout(shouldRedirect = true) {
    this.token = null;
    this.user = null;
    api.setToken(null);
    this.notify();

    if (shouldRedirect) {
      window.location.hash = '#/login';
    }
  }

  getUser() {
    return this.user;
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  getRole() {
    return this.user?.role || null;
  }
}

export const auth = new AuthStore();
export default auth;
