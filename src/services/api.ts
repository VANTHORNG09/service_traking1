import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Replace with your backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for JWT token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, clear it
      await SecureStore.deleteItemAsync('authToken');
      // Redirect to login or handle token refresh here
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = async (token: string) => {
  await SecureStore.setItemAsync('authToken', token);
};

export const removeAuthToken = async () => {
  await SecureStore.deleteItemAsync('authToken');
};

export const getAuthToken = async () => {
  return await SecureStore.getItemAsync('authToken');
};

export default api;