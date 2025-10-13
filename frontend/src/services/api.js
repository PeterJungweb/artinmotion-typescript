import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - automatically add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors (unauthorized) - auto logout
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  }
);

// Paintings API
export const paintingsApi = {
  async getAll() {
    const response = await api.get("paintings");
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`paintings/${id}`);
    return response.data;
  },

  async getByCategory(category) {
    const response = await api.get(`paintings?category=${category}`);
    return response.data;
  },
};

// Cart API
export const cartApi = {
  async calculateTotals(items) {
    const response = await api.post("cart/calculate", { items });
    return response.data;
  },

  async addToCart(paintingId, userId = null, sessionId = null) {
    const session =
      sessionId ||
      localStorage.getItem("cartSessionId") ||
      `session-${Date.now()}`;

    // Store session for future use
    if (!localStorage.getItem("cartSessionId")) {
      localStorage.setItem("cartSessionId", session);
    }

    const requestData = {
      painting_id: paintingId,
      user_id: userId,
      session_id: session,
    };

    const response = await api.post("cart/add", requestData);
    return response.data;
  },

  async removeFromCart(paintingId, userId = null, sessionId = null) {
    // Use same session ID from localStorage
    const session = sessionId || localStorage.getItem("cartSessionId");

    const response = await api.delete(`cart/remove/${paintingId}`, {
      data: {
        user_id: userId,
        session_id: session,
      },
    });
    return response.data;
  },
};

// Orders API
export const ordersApi = {
  async create(orderData) {
    const response = await api.post("orders", orderData);
    return response.data;
  },
};

export default api;
