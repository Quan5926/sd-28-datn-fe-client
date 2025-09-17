import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/auth';

// Create axios instance with default config
const authAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API endpoints
export const AuthAPI = {
  // Login endpoint
  login: async (loginData) => {
    try {
      const response = await authAPI.post('/login', {
        tenDangNhap: loginData.username || loginData.email, // Support both username and email
        matKhau: loginData.password,
        rememberMe: loginData.rememberMe || false
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout endpoint
  logout: async (userId = null) => {
    try {
      const url = userId ? `/logout?userId=${userId}` : '/logout';
      const response = await authAPI.post(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default AuthAPI;
