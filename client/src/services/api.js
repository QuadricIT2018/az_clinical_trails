import axios from 'axios';

// Use relative path for proxy support in development
// In production, use the full URL from environment variable
const API_URL = process.env.REACT_APP_API_URL || 'https://az-clinical-trails-api.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  verify: () => api.get('/auth/verify')
};

// Registrations API (General Interest)
export const registrationsAPI = {
  create: (data) => api.post('/registrations', data),
  getAll: () => api.get('/registrations'),
  getOne: (id) => api.get(`/registrations/${id}`),
  update: (id, data) => api.put(`/registrations/${id}`, data),
  delete: (id) => api.delete(`/registrations/${id}`)
};

// Cell Therapy Interest API
export const cellTherapyAPI = {
  create: (data) => api.post('/cell-therapy-interest', data),
  getAll: (params) => api.get('/cell-therapy-interest', { params }),
  getOne: (id) => api.get(`/cell-therapy-interest/${id}`),
  update: (id, data) => api.patch(`/cell-therapy-interest/${id}`, data),
  delete: (id) => api.delete(`/cell-therapy-interest/${id}`)
};

export default api;
