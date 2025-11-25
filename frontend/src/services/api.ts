import axios, { isAxiosError } from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import type {
  GetAllPaintingsResponse,
  PaintingFromBackend,
  AddToCartResponse,
  RemoveFromCartResponse,
} from "../types/apiTypes";
import { CartItem, CartTotals } from "../types/cartTypes";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - automatically add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: unknown) => {
    let errorStatus;

    if (isAxiosError(error)) {
      errorStatus = error.response?.status;
    }
    // Handle 401 errors (unauthorized) - auto logout
    if (errorStatus === 401) {
      localStorage.removeItem("authToken");
      window.dispatchEvent(new Event("auth:logout"));
    }
    return Promise.reject(error);
  }
);

// Paintings API
export const paintingsApi = {
  async getAll(): Promise<GetAllPaintingsResponse> {
    const response = await api.get("paintings");
    return response.data;
  },

  async getById(id: string): Promise<PaintingFromBackend> {
    const response = await api.get(`paintings/${id}`);
    return response.data;
  },

  async getByCategory(category: string): Promise<GetAllPaintingsResponse> {
    const response = await api.get(`paintings?category=${category}`);
    return response.data;
  },
};

// Cart API
export const cartApi = {
  async calculateTotals(items: CartItem[]): Promise<CartTotals> {
    const response = await api.post("cart/calculate", { items });
    return response.data;
  },

  async addToCart(
    paintingId: string,
    userId: string | null = null,
    sessionId: string | null = null
  ): Promise<AddToCartResponse> {
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

  async removeFromCart(
    paintingId: string,
    userId: string | null = null,
    sessionId: string | null = null
  ): Promise<RemoveFromCartResponse> {
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
  async create(orderData: any): Promise<any> {
    const response = await api.post("orders", orderData);
    return response.data;
  },
};

export default api;
