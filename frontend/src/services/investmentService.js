import api from '../lib/api';

export const createInvestment = async (planId) => {
  const response = await api.post('/investments', { planId });
  return response.data;
};

export const getInvestments = async () => {
  const response = await api.get('/investments');
  return response.data;
};

export const getInvestmentById = async (id) => {
  const response = await api.get(`/investments/${id}`);
  return response.data;
};

export const investmentService = {
  createInvestment,
  getInvestments,
  getInvestmentById,
};

export default investmentService;
