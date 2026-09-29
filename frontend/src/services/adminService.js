import api from '../lib/api';

export const getDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

export const getUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const updateUserStatus = async (id, status) => {
  const response = await api.patch(`/admin/users/${id}/status`, { status });
  return response.data;
};

export const getPlans = async () => {
  const response = await api.get('/admin/plans');
  return response.data;
};

export const createPlan = async (planData) => {
  const response = await api.post('/admin/plans', planData);
  return response.data;
};

export const updatePlan = async (id, planData) => {
  const response = await api.patch(`/admin/plans/${id}`, planData);
  return response.data;
};

export const deletePlan = async (id) => {
  const response = await api.delete(`/admin/plans/${id}`);
  return response.data;
};

export const getDeposits = async (params = {}) => {
  const response = await api.get('/admin/deposits', { params });
  return response.data;
};

export const updateDepositStatus = async (id, status, utr = '') => {
  const response = await api.patch(`/admin/deposits/${id}/status`, { status, utr });
  return response.data;
};

export const getWithdrawals = async (params = {}) => {
  const response = await api.get('/admin/withdrawals', { params });
  return response.data;
};

export const updateWithdrawalStatus = async (id, status, adminNote = '') => {
  const response = await api.patch(`/admin/withdrawals/${id}/status`, { status, adminNote });
  return response.data;
};

export const getSettings = async () => {
  const response = await api.get('/admin/settings');
  return response.data;
};

export const updateSetting = async (key, value) => {
  const response = await api.put('/admin/settings', { key, value });
  return response.data;
};

export const adminService = {
  getDashboard,
  getUsers,
  updateUserStatus,
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getDeposits,
  updateDepositStatus,
  getWithdrawals,
  updateWithdrawalStatus,
  getSettings,
  updateSetting
};

export default adminService;

