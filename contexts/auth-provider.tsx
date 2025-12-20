"use client";

import { api } from "@/lib/api";
import { env } from "@/lib/env";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useLocalStorage } from "usehooks-ts";

interface AuthContextData {
  token: string | null;
  isAuthenticated: boolean;
  isValidating: boolean;
  validateToken: (token: string) => Promise<boolean>;
  clearToken: () => void;
}

const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken, removeToken] = useLocalStorage<string | null>(
    env.NEXT_PUBLIC_AUTH_TOKEN_KEY,
    null
  );

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateStoredToken = async () => {
      if (!token) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      try {
        const res = await api.post("/api/auth/validate", { token });

        if (!res?.data?.valid) throw new Error();

        setIsAuthenticated(true);
      } catch {
        removeToken();
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateStoredToken();
  }, [token, removeToken]);

  const validateToken = async (tokenToValidate: string) => {
    setIsValidating(true);

    try {
      const res = await api.post("/api/auth/validate", {
        token: tokenToValidate,
      });

      if (!res?.data?.valid) throw new Error();

      setToken(tokenToValidate);
      setIsAuthenticated(true);
      return true;
    } catch {
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const clearToken = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        isValidating,
        validateToken,
        clearToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
