"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { isLoggedIn } from "@/lib/api";

interface AuthContextValue {
  authenticated: boolean;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  authenticated: false,
  refreshAuth: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isLoggedIn());
  }, []);

  const refreshAuth = useCallback(() => {
    setAuthenticated(isLoggedIn());
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
