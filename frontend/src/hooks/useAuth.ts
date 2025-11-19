import { useState, useEffect, useCallback } from "react";
import { authApi } from "../services/authApi.js";
import type {
  UseAuthReturn,
  AuthResponse,
  AuthState,
  RegisterData,
} from "../types/authTypes.js";
import { isAxiosError } from "axios";

export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  });

  // Verify token and get user profile
  const verifyToken = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      const result = await authApi.getProfile();

      if (result.success) {
        setState((prev) => ({
          ...prev,
          user: result.user,
          token: authApi.getToken(),
          isAuthenticated: true,
          loading: false,
          error: null,
        }));
        console.log("✅ Token verified, user authenticated");
      } else {
        // Token is invalid, clear auth state
        authApi.removeToken();
        setState((prev) => ({
          ...prev,
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        }));
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      authApi.removeToken();
      setState((prev) => ({
        ...prev,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }));
    }
  }, []);

  // Check for existing token on hook initialization
  useEffect(() => {
    const token = authApi.getToken();
    if (token) {
      // Verify token is still valid
      verifyToken();
    }
  }, [verifyToken]);

  // Login function
  const login = useCallback(async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await authApi.login(email, password);

      if (result.success) {
        setState((prev) => ({
          ...prev,
          user: result.user,
          token: result.token,
          isAuthenticated: true,
          loading: false,
          error: null,
        }));
        console.log("✅ Login successful:", result.user.email);
        return { success: true };
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: result.error,
        }));
        return { success: false, error: result.error };
      }
    } catch (error: unknown) {
      console.error("Login error: ", error);
      let errorMessage = "Login failed. Please try again.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }
      if (isAxiosError(error) && error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Register function
  const register = useCallback(async (userData: RegisterData) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const result = await authApi.register(userData);

      if (result.success) {
        setState((prev) => ({
          ...prev,
          user: result.user,
          token: result.token,
          isAuthenticated: true,
          loading: false,
          error: null,
        }));
        console.log("✅ Registration successful:", result.user.email);
        return { success: true };
      } else {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: result.error,
        }));
        return {
          success: false,
          error: result.error,
          details: result.details,
        };
      }
    } catch (error: unknown) {
      console.error("Registration error: ", error);
      let errorMessage = "Registration failed. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      if (isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout locally even if API call fails
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      });
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    login,
    register,
    logout,
    clearError,
    verifyToken,
  };
};
