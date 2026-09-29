import api from '../lib/api';

export const getEarnings = async () => {
  const response = await api.get('/earnings');
  return response.data;
};

export const getEarningsSummary = async () => {
  const response = await api.get('/earnings/summary');
  return response.data;
};

export const earningService = {
  getEarnings,
  getEarningsSummary,
};

export default earningService;
