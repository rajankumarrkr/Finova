import api from '../lib/api';

export const createDeposit = async (amount) => {
  const response = await api.post('/deposits/create', { amount: Number(amount) });
  return response.data;
};

export const getDepositById = async (id) => {
  const response = await api.get(`/deposits/${id}`);
  return response.data;
};

export const verifyDeposit = async (id, utrOrData, screenshotData = null, autoApprove = false) => {
  let body = {};
  if (typeof utrOrData === 'object' && utrOrData !== null) {
    body = { ...utrOrData };
  } else {
    body = { utr: utrOrData, screenshot: screenshotData, autoApprove };
  }
  const response = await api.post(`/deposits/${id}/verify`, body);
  return response.data;
};

export const getDepositHistory = async (params = {}) => {
  const response = await api.get('/deposits/history', { params });
  return response.data;
};

export const depositService = {
  createDeposit,
  getDepositById,
  verifyDeposit,
  getDepositHistory
};

export default depositService;
