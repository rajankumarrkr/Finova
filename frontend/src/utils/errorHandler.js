/**
 * Reusable Error Handler for API Responses
 * Converts backend status codes and error objects into clean, user-friendly messages.
 */
export const getErrorMessage = (error, fallbackMessage = 'Something went wrong. Please try again.') => {
  if (!error) return fallbackMessage;

  // If it's already a string
  if (typeof error === 'string') return error;

  // Response object from Axios
  const response = error.response;
  if (response) {
    const status = response.status;
    const data = response.data;

    // Check message in backend response
    if (data && data.message && typeof data.message === 'string') {
      // Clean up common error formats if needed
      return data.message;
    }

    // Default status-code based messages
    switch (status) {
      case 400:
        return data?.message || 'Invalid request parameters. Please check your input.';
      case 401:
        return 'Session expired. Please log in again.';
      case 403:
        return data?.message || 'Access denied. You do not have permission for this action.';
      case 404:
        return data?.message || 'Requested resource not found.';
      case 409:
        return data?.message || 'Conflict detected. Resource already exists.';
      case 422:
        return data?.message || 'Validation error. Please check your data.';
      case 429:
        return 'Too many requests. Please slow down and try again shortly.';
      case 500:
      case 502:
      case 503:
      case 504:
        return 'Server error. Our team has been notified. Please try again later.';
      default:
        return fallbackMessage;
    }
  }

  // Network / Connection Error
  if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
    return 'Unable to connect to server. Please check your internet connection.';
  }

  if (error.message) {
    return error.message;
  }

  return fallbackMessage;
};
