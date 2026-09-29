import api from '../lib/api';

export const getBankAccounts = async () => {
  const response = await api.get('/bank-accounts');
  return response.data;
};

export const addBankAccount = async (bankData) => {
  const response = await api.post('/bank-accounts', bankData);
  return response.data;
};

export const deleteBankAccount = async (id) => {
  const response = await api.delete(`/bank-accounts/${id}`);
  return response.data;
};

export const bankService = {
  getBankAccounts,
  addBankAccount,
  deleteBankAccount,
};

export default bankService;
