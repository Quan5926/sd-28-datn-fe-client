import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/auth';
const CLIENT_BASE_URL = 'http://localhost:8080/api/auth-client';

// Create axios instance with default config for admin/employee auth
const authAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance with default config for customer auth
const authClientAPI = axios.create({
  baseURL: CLIENT_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API endpoints
export const AuthAPI = {
  // Admin/Employee login endpoint (roles 1, 2)
  adminLogin: async (loginData) => {
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

  // Customer login endpoint (role 3)
  login: async (loginData) => {
    try {
      const response = await authClientAPI.post('/login', {
        tenDangNhap: loginData.username || loginData.email, // Support both username and email
        matKhau: loginData.password,
        rememberMe: loginData.rememberMe || false
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin/Employee logout endpoint
  adminLogout: async (userId = null) => {
    try {
      const url = userId ? `/logout?userId=${userId}` : '/logout';
      const response = await authAPI.post(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Customer logout endpoint
  logout: async (userId = null) => {
    try {
      const url = userId ? `/logout?userId=${userId}` : '/logout';
      const response = await authClientAPI.post(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Customer registration endpoint
  register: async (registerData) => {
    try {
      const response = await authClientAPI.post('/register', {
        name: registerData.name,
        email: registerData.email,
        phoneNumber: registerData.phoneNumber,
        password: registerData.password
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default AuthAPI;
