const API_BASE = import.meta.env.VITE_API_BASE || "";

async function request(path, options = {}) {
  const token = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE}/api${path}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      let errorMessage = "Network response was not ok";

      try {
        const errorData = await res.json();
        errorMessage = errorData.msg || errorData.message || errorMessage;
      } catch { }

      switch (res.status) {
        case 400:
          throw new Error(`Bad Request: ${errorMessage}`);

        case 401:
          localStorage.removeItem("access_token");
          throw new Error("Authentication required. Please log in again.");

        case 403:
          throw new Error("Access denied. You do not have permission for this action.");

        case 404:
          throw new Error("Resource not found.");

        case 500:
          throw new Error("Server error. Please try again later.");

        default:
          throw new Error(errorMessage);
      }
    }

    return res.json();
  } catch (error) {
    if (error.name === "TypeError") {
      console.error("Network error:", error);
      throw new Error("Network connection failed. Please check your internet connection.");
    }

    throw error;
  }
}

export const api = {

  // AUTH
  login: (email, password) =>
    request("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data) =>
    request("/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // USERS
  getUsers: () => request("/users"),

  getMe: () => request("/me"),

  getUser: (id) => request(`/users/${id}`),

  updateUser: (id, data) =>
    request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // EXCHANGES
  getExchanges: () => request("/exchanges"),

  createExchange: (data) =>
    request("/exchanges", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateExchange: (id, data) =>
    request(`/exchanges/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // MATCHES
  getMatches: () => request("/matches"),

  // STATS
  getStats: () => request("/stats"),

  // NOTIFICATIONS
  getNotifications: () => request("/notifications"),

  createNotification: (data) =>
    request("/notifications", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  markNotificationRead: (id) =>
    request(`/notifications/${id}/read`, {
      method: "PATCH",
    }),
};