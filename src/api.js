import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const login = async (credentials) => {
  try {
    const response = await api.post('/token/', credentials);
    localStorage.setItem('token', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

const isTokenExpired = () => {
  const expiry = localStorage.getItem('token_expiry');
  return expiry && new Date().getTime() > expiry;
};

const getAccessToken = async () => {
  if (isTokenExpired()) {
    await refreshToken();
  }
  return localStorage.getItem('access_token');
};

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await api.post('/token/refresh/', { refresh: refreshToken });
    localStorage.setItem('token', response.data.access);
    return response.data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    throw error;
  }
};

export const fetchExpenses = async () => {
  try {
    const token = await getAccessToken();
    const response = await api.get('/expenses', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Fetch expenses failed:', error);
    throw error;
  }
};

export const createExpense = async (data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/expenses/', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Create expense failed:', error);
    throw error;
  }
};

export const updateExpense = async (id, data) => {
  const token = localStorage.getItem('token');
  return api.put(`/expenses/${id}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteExpense = async (id) => {
  try {
    const token = localStorage.getItem('token');
    await api.delete(`/expenses/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Delete expense failed:', error);
    throw error;
  }
};

// Register new user function
export const register = async (userData) => {
  try {
    const response = await api.post('/register/', userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

export default api;
