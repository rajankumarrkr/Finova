import api from '../lib/api';

export const getPlans = async () => {
  const response = await api.get('/plans');
  return response.data;
};

export const getPlanById = async (id) => {
  const response = await api.get(`/plans/${id}`);
  return response.data;
};

export const planService = {
  getPlans,
  getPlanById,
};

export default planService;
