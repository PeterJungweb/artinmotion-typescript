export interface User {
  id: string;
  email: string;
  fullName?: string | null;
  emailVerified: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export type AuthResponse =
  | { success: true }
  | { success: false; error: string; details: string[] };

export interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
  verifyToken: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}
