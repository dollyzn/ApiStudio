"use client";

import axios from "axios";
import { env } from "@/lib/env";

export const api = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(env.NEXT_PUBLIC_AUTH_TOKEN_KEY);

      if (token) {
        config.headers["Authorization"] = token;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);
