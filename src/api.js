const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

async function request(path, options = {}) {
  const token = localStorage.getItem('access_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // if API_BASE is empty we rely on proxy and prefix '/api'
  const url = (API_BASE ? API_BASE : '') + '/api' + path;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => { });
    throw err || new Error('Network response was not ok');
  }
  return res.json();
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
};
