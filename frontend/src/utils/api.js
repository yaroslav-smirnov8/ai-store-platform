import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://aistore-dev-api.ru.tuna.am/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Pure web app - no Telegram headers needed
// Track unique users via session/cookies on backend

// Add authorization token from localStorage if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getById: (id) => api.get(`/orders/${id}`),
};

// Payments API
export const paymentsAPI = {
  create: (orderData) => api.post('/payments/create', orderData),
  getStatus: (paymentId) => api.get(`/payments/${paymentId}/status`),
};

// Analytics API
export const analyticsAPI = {
  trackClick: (clickData) => api.post('/analytics/click', clickData),
};

// Admin API
export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  getDashboard: () => api.get('/admin/dashboard'),
  getNotifications: () => api.get('/admin/notifications'),
};

export default api;
