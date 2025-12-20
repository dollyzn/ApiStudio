"use client";

import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";

const AUTH_TOKEN_KEY = "api_studio_token";

export function useAuth() {
  const [token, setToken, removeToken] = useLocalStorage<string | null>(
    AUTH_TOKEN_KEY,
    null
  );

  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean>(false);

  const validateToken = async (tokenToValidate: string) => {
    setIsValidating(true);
    try {
      const res = await fetch("/api/auth/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToValidate }),
      });

      if (!res.ok) {
        throw new Error("Token inválido");
      }

      setIsValid(true);
      setToken(tokenToValidate);
      return true;
    } catch {
      setIsValid(false);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const clearToken = () => {
    removeToken();
    setIsValid(false);
  };

  return {
    token,
    isAuthenticated: !!token && isValid,
    isValidating,
    validateToken,
    clearToken,
  };
}
