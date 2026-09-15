import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to inject JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusbite_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses to handle 401 token expiry
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    if (error.response?.status === 401) {
      // If token expired, clear and redirect only if not already on login
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('campusbite_token');
        localStorage.removeItem('campusbite_user');
      }
    }

    return Promise.reject({
      status: error.response?.status,
      message,
      errors: error.response?.data?.errors,
    });
  }
);
