import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance
const axiosInstance = axios.create({
  // Change this to match your backend server URL
  baseURL: 'http://192.168.100.129:5000', // Your computer's IP address
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add token to requests
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log request for debugging
      console.log('📤 Request:', config.method.toUpperCase(), config.url);
      console.log('📤 Full URL:', config.baseURL + config.url);
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('❌ Response Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('❌ No Response from Server');
      console.error('❌ Check if backend is running at:', axiosInstance.defaults.baseURL);
      console.error('❌ Attempted URL:', error.config?.url);
    } else {
      // Something else happened
      console.error('❌ Request Setup Error:', error.message);
    }

    // Handle 401 - Unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        console.log('🔒 Token cleared due to 401 error');
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;