import api from '../lib/api';

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const refresh = async () => {
  const response = await api.post('/auth/refresh');
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.patch('/user/profile', profileData);
  return response.data;
};

export const authService = {
  register,
  login,
  logout,
  refresh,
  getMe,
  updateProfile,
};

export default authService;
