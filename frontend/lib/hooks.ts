"use client";

import { useState, useCallback } from "react";
import { isLoggedIn } from "@/lib/api";

export function useRequireAuth() {
  const checkAuth = useCallback(() => {
    if (!isLoggedIn()) {
      alert("Please login first.");
      return false;
    }
    return true;
  }, []);

  return { checkAuth };
}

export function useLoadingState(initial = false) {
  const [loading, setLoading] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, setError, withLoading };
}
