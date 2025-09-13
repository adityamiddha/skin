import axios from 'axios';

// Determine API base URL dynamically based on environment
// - Local dev: http://localhost:3000/api
// - Production (Render): https://skin-sxau.onrender.com/api
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const API_BASE_URL = isLocalhost
  ? 'http://localhost:3000/api'
  : `${window.location.origin}/api`;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token (still optional if you keep JWT in localStorage)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/getMe'),
  updateMe: (userData) => api.patch('/auth/updateMe', userData),
  updatePassword: (passwordData) => api.patch('/auth/updateMyPassword', passwordData),
};

// Image API calls
export const imageAPI = {
  uploadImage: (formData) =>
    api.post('/image/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMyImages: () => api.get('/image/my-images'),
};

// AI API calls
export const aiAPI = {
  analyzeImage: (imageId) => api.post(`/ai/scan/${imageId}`),
};

// Scan Results API calls
export const scanResultsAPI = {
  createScanResult: (scanData) => api.post('/scans', scanData),
  getMyScanResults: () => api.get('/scans/my-scans'),
  compareScanResults: (scanIds) => api.post('/scans/compare-scans', scanIds),
};

export default api;
