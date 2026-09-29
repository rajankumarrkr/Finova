import axios from 'axios';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    // In production build, prevent accidental localhost fallback
    if (import.meta.env.PROD && (envUrl.includes('localhost') || envUrl.includes('127.0.0.1'))) {
      return 'https://finova-sv93.onrender.com/api';
    }
    return envUrl.trim();
  }
  return 'https://finova-sv93.onrender.com/api';
};

export const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach access token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('finova_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Token refresh queuing for concurrent 401 requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor for automatic token refresh & error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      const isAuthEndpoint =
        originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh');

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshUrl = `${API_BASE_URL}/auth/refresh`;
        const response = await axios.post(
          refreshUrl,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data?.data?.accessToken || response.data?.accessToken;

        if (newAccessToken) {
          localStorage.setItem('finova_token', newAccessToken);
          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return api(originalRequest);
        } else {
          processQueue(error, null);
          localStorage.removeItem('finova_token');
          localStorage.removeItem('finova_user');
          localStorage.removeItem('finova_auth');
          window.dispatchEvent(new CustomEvent('finova_auth_logout'));
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('finova_token');
        localStorage.removeItem('finova_user');
        localStorage.removeItem('finova_auth');
        window.dispatchEvent(new CustomEvent('finova_auth_logout'));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
