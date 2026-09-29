import api from '../lib/api';

export const getDashboard = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const getPerformance = async (range = '1M') => {
  const response = await api.get('/dashboard/performance', {
    params: { range },
  });
  return response.data;
};

export const dashboardService = {
  getDashboard,
  getPerformance,
};

export default dashboardService;
