const API_BASE =
  import.meta.env.VITE_API_BASE ||
  "https://barterlearn-collaborative-learning-45hs.onrender.com";

async function request(path, options = {}) {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}/api${path}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.msg || "Request failed");
  }

  return data;
}

export const api = {
  login: (email, password) =>
    request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),

  register: (data) =>
    request("/register", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  getUsers: () => request("/users"),

  getMe: () => request("/me"),

  updateUser: (data) =>
    request("/me", {
      method: "PUT",
      body: JSON.stringify(data)
    }),

  getMatches: () => request("/matches"),

  getExchanges: () => request("/exchanges"),

  createExchange: (data) =>
    request("/exchanges", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  updateExchange: (id, data) =>
    request(`/exchanges/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data)
    }),

  getNotifications: () => request("/notifications"),

  markNotificationRead: (id) =>
    request(`/notifications/${id}/read`, {
      method: "PATCH"
    })
};