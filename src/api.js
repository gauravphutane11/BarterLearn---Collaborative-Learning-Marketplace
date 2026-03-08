const API_BASE = import.meta.env.VITE_API_BASE || '';

async function request(path, options = {}) {
  const token = localStorage.getItem('access_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Use API_BASE if provided, otherwise use relative path
  const url = `${API_BASE}/api${path}`;

  try {
    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
      let errorMessage = 'Network response was not ok';
      let errorData = null;

      try {
        errorData = await res.json();
        errorMessage = errorData.msg || errorData.message || errorMessage;
      } catch (parseError) {
        console.warn('Failed to parse error response as JSON:', parseError);
      }

      // Handle specific HTTP status codes
      switch (res.status) {
        case 400:
          throw new Error(`Bad Request: ${errorMessage}`);
        case 401:
          // Clear invalid token
          localStorage.removeItem('access_token');
          throw new Error('Authentication required. Please log in again.');
        case 403:
          throw new Error('Access denied. You do not have permission for this action.');
        case 404:
          throw new Error('Resource not found.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(errorMessage);
      }
    }

    return res.json();
  } catch (error) {
    // Log network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('Network error:', error);
      throw new Error('Network connection failed. Please check your internet connection.');
    }

    // Re-throw custom errors
    if (error.message.includes('Bad Request') ||
        error.message.includes('Authentication') ||
        error.message.includes('Access denied') ||
        error.message.includes('Server error') ||
        error.message.includes('Network connection')) {
      throw error;
    }

    // Re-throw other errors as-is
    throw error;
  }
}

export const api = {
  login: (email, password) => request('/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data) => request('/register', { method: 'POST', body: JSON.stringify(data) }),
  getUsers: () => request('/users'),
  getMe: () => request('/me'),
  getUser: (id) => request(`/users/${id}`),
  updateUser: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getExchanges: () => request('/exchanges'),
  createExchange: (data) => request('/exchanges', { method: 'POST', body: JSON.stringify(data) }),
  updateExchange: (id, data) => request(`/exchanges/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getMatches: () => request('/matches'),
  getStats: () => request('/stats'),
};
