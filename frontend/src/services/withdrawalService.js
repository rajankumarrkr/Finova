import api from '../lib/api';

export const requestWithdrawal = async ({ amount, bankAccountId }) => {
  const response = await api.post('/withdrawals', { amount, bankAccountId });
  return response.data;
};

export const getWithdrawals = async () => {
  const response = await api.get('/withdrawals');
  return response.data;
};

export const withdrawalService = {
  requestWithdrawal,
  getWithdrawals,
};

export default withdrawalService;
