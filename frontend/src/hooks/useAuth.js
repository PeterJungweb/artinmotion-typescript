import { useState, useEffect, useCallback } from "react";
import { authApi } from "../services/authApi.js";

export const useAuth = () => {
  const [state, setState] = useState({
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
  const login = useCallback(async (email, password) => {
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
    } catch (error) {
      console.error("Login error:", error.message || error);
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
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
    } catch (error) {
      console.error("Registration error:", error.message || error);
      const errorMessage =
        error.response?.data?.error || "Registration failed. Please try again.";
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
