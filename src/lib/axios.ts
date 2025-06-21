import axios from 'axios';

// Create a custom axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
axiosInstance.interceptors.request.use(
  (config) => {
    // Add any auth tokens if needed
    // const token = getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors globally
    // You could redirect to login page on 401, show error messages, etc.
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // e.g., redirect to login
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
