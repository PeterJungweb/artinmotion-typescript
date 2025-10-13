/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useMemo } from "react";
import { useAuth as useAuthHook } from "../hooks/useAuth.js";

const AuthContext = createContext(null); // ✅ Default value

export const AuthProvider = ({ children }) => {
  const auth = useAuthHook();

  const contextValue = useMemo(() => auth, [auth]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

// ✅ Named export for better debugging
export { AuthContext };
export default AuthContext;
