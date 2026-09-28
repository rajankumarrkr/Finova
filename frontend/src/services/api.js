const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Generic HTTP Request Helper for REST API calls
 */
async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('finova_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include' // Send HTTP-only cookies (refresh token)
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API Request Failed');
  }
  return data;
}

export const api = {
  // Authentication
  register: (userData) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  login: (credentials) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => fetchApi('/auth/logout', { method: 'POST' }),
  getMe: () => fetchApi('/auth/me'),

  // Dashboard & Metrics
  getDashboard: () => fetchApi('/dashboard'),
  getPerformance: (range = '1M') => fetchApi(`/dashboard/performance?range=${range}`),

  // Investment Plans
  getPlans: () => fetchApi('/plans'),

  // Investments
  createInvestment: (planId) => fetchApi('/investments', { method: 'POST', body: JSON.stringify({ planId }) }),
  getInvestments: () => fetchApi('/investments'),

  // Earnings
  getEarnings: () => fetchApi('/earnings'),
  getEarningsSummary: () => fetchApi('/earnings/summary'),

  // Transactions
  getTransactions: (query = '') => fetchApi(`/transactions?${query}`),

  // Referrals
  getReferralStats: () => fetchApi('/referrals/stats'),
  getReferralHistory: () => fetchApi('/referrals/history'),

  // Payments / Deposits
  createDepositOrder: (amount) => fetchApi('/payments/create-order', { method: 'POST', body: JSON.stringify({ amount }) }),
  verifyDepositPayment: (paymentData) => fetchApi('/payments/verify', { method: 'POST', body: JSON.stringify(paymentData) }),

  // Withdrawals
  requestWithdrawal: (withdrawalData) => fetchApi('/withdrawals', { method: 'POST', body: JSON.stringify(withdrawalData) }),
  getWithdrawals: () => fetchApi('/withdrawals'),

  // Bank Accounts
  getBankAccounts: () => fetchApi('/bank-accounts'),
  addBankAccount: (bankData) => fetchApi('/bank-accounts', { method: 'POST', body: JSON.stringify(bankData) }),
  deleteBankAccount: (id) => fetchApi(`/bank-accounts/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: () => fetchApi('/notifications'),
  markNotificationRead: (id) => fetchApi(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => fetchApi('/notifications/read-all', { method: 'PATCH' })
};
