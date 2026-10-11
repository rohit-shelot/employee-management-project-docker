import axios from 'axios';

// Base URL configured via environment variable with fallback to local backend port 5000
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor to handle unified error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';
    if (error.response) {
      // Backend returned an error response
      message = error.response.data?.message || `Server Error (${error.response.status})`;
    } else if (error.request) {
      // Request made but no response (e.g. backend down or CORS blocked)
      message = 'Unable to connect to the server. Please check your network connection and try again.';
    } else {
      message = error.message;
    }
    return Promise.reject(new Error(message));
  }
);

// Centralized API Service functions
export const getDashboardStats = async () => {
  const response = await apiClient.get('/dashboard/stats');
  return response.data;
};

export const getEmployees = async (params = {}) => {
  const response = await apiClient.get('/employees', { params });
  return response.data;
};

export const getEmployeeById = async (id) => {
  const response = await apiClient.get(`/employees/${id}`);
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const response = await apiClient.post('/employees', employeeData);
  return response.data;
};

export const updateEmployee = async (id, employeeData) => {
  const response = await apiClient.put(`/employees/${id}`, employeeData);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await apiClient.delete(`/employees/${id}`);
  return response.data;
};

export const getHealth = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export default apiClient;
