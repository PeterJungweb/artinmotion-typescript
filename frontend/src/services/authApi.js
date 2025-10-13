import api from "./api.js";

export const authApi = {
  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData);

      if (response.data.success && response.data.token) {
        this.setToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
        details: error.response?.data?.details,
      };
    }
  },

  async login(email, password) {
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data.success && response.data.token) {
        this.setToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  },

  async getProfile() {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to get profile",
      };
    }
  },

  async logout() {
    this.removeToken();
    return { success: true };
  },

  // Token management
  getToken() {
    return localStorage.getItem("authToken");
  },

  setToken(token) {
    localStorage.setItem("authToken", token);
    console.log("🎫 Auth token stored");
  },

  removeToken() {
    localStorage.removeItem("authToken");
    console.log("🗑️ Auth token removed");
  },

  // Check if token exists and is not expired
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Basic JWT expiration check
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  },
};
