import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
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
  uploadImage: (formData) => api.post('/image/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
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

