import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const res = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh });
          localStorage.setItem('access_token', res.data.access);
          original.headers.Authorization = `Bearer ${res.data.access}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  me: () => api.get('/auth/me/'),
  updateMe: (data) => api.put('/auth/me/', data),
  searchUsers: (q) => api.get(`/auth/search/?q=${q}`),
};

// Friends
export const friendsAPI = {
  list: () => api.get('/friends/'),
  add: (email) => api.post('/friends/add/', { email }),
  remove: (id) => api.delete(`/friends/${id}/remove/`),
};

// Groups
export const groupsAPI = {
  list: () => api.get('/groups/'),
  create: (data) => api.post('/groups/', data),
  get: (id) => api.get(`/groups/${id}/`),
  update: (id, data) => api.put(`/groups/${id}/`, data),
  delete: (id) => api.delete(`/groups/${id}/`),
  invite: (id, email) => api.post(`/groups/${id}/invite/`, { email }),
  removeMember: (groupId, userId) => api.delete(`/groups/${groupId}/members/${userId}/remove/`),
};

// Expenses
export const expensesAPI = {
  list: (params) => api.get('/expenses/', { params }),
  create: (data) => api.post('/expenses/', data),
  get: (id) => api.get(`/expenses/${id}/`),
  update: (id, data) => api.put(`/expenses/${id}/`, data),
  delete: (id) => api.delete(`/expenses/${id}/`),
};

// Payments
export const paymentsAPI = {
  list: (params) => api.get('/payments/', { params }),
  create: (data) => api.post('/payments/', data),
  delete: (id) => api.delete(`/payments/${id}/`),
};

// Balances
export const balancesAPI = {
  user: () => api.get('/balances/user/'),
  group: (id) => api.get(`/balances/group/${id}/`),
  friend: (id) => api.get(`/balances/friend/${id}/`),
};

// Chat
export const chatAPI = {
  messages: (expenseId) => api.get(`/chat/${expenseId}/messages/`),
  send: (expenseId, content) => api.post(`/chat/${expenseId}/messages/`, { content }),
};
