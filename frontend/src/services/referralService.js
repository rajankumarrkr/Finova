import api from '../lib/api';

export const getReferralStats = async () => {
  const response = await api.get('/referrals/stats');
  return response.data;
};

export const getReferralHistory = async () => {
  const response = await api.get('/referrals/history');
  return response.data;
};

export const referralService = {
  getReferralStats,
  getReferralHistory,
};

export default referralService;
