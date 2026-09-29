import api from '../lib/api';

export const getTransactions = async (params = {}) => {
  const response = await api.get('/transactions', { params });
  return response.data;
};

export const transactionService = {
  getTransactions,
};

export default transactionService;
