import { isAxiosError } from "axios";
import api from "./api.js";
import type { AuthApiResponse, RegisterData } from "../types/authTypes.js";

export const authApi = {
  async register(userData: RegisterData): Promise<AuthApiResponse> {
    try {
      const response = await api.post("/auth/register", userData);

      if (response.data.success && response.data.token) {
        this.setToken(response.data.token);
      }

      return response.data;
    } catch (error: unknown) {
      let errorMessage = "Registration failed";
      let errorDetails: string[] = [];

      if (error instanceof Error) {
        errorMessage = error.message;
      }
      if (isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
        errorDetails = error.response.data.details || [];
      }
      return {
        success: false,
        error: errorMessage || "Registration failed",
        details: errorDetails,
      };
    }
  },

  async login(email: string, password: string): Promise<AuthApiResponse> {
    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data.success && response.data.token) {
        this.setToken(response.data.token);
      }

      return response.data;
    } catch (error: unknown) {
      let errorMessage = "Login failed";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      if (isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      return {
        success: false,
        error: errorMessage || "Login failed",
      };
    }
  },

  async getProfile(): Promise<AuthApiResponse> {
    try {
      const response = await api.get("/auth/profile");
      return response.data;
    } catch (error: unknown) {
      let errorMessage = "Failed to get Profile";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      if (isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      return {
        success: false,
        error: errorMessage || "Failed to get profile",
      };
    }
  },

  async logout(): Promise<{ success: boolean }> {
    this.removeToken();
    return { success: true };
  },

  // Token management
  getToken(): string | null {
    return localStorage.getItem("authToken");
  },

  setToken(token: string): void {
    localStorage.setItem("authToken", token);
    console.log("🎫 Auth token stored");
  },

  removeToken(): void {
    localStorage.removeItem("authToken");
    console.log("🗑️ Auth token removed");
  },

  // Check if token exists and is not expired
  isAuthenticated(): boolean {
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
