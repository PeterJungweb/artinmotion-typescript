import React, { createContext, useContext, useMemo } from "react";
import type { JSX, ReactNode } from "react";
import { useAuth as useAuthHook } from "../hooks/useAuth.js";

type AuthContextType = ReturnType<typeof useAuthHook> | null;

const AuthContext = createContext<AuthContextType>(null); // Default value

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuthHook();

  const contextValue = useMemo(() => auth, [auth]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuthContext = (): NonNullable<AuthContextType> => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

//  Named export for better debugging
export { AuthContext };
export default AuthContext;
