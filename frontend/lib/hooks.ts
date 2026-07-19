"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { isLoggedIn, apiGet, apiPost } from "@/lib/api";
import type { CartItem } from "@/types";

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

export function useCartItems() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    try {
      const data = await apiGet<CartItem[]>("/cart", true);
      setCartItems(data);
    } catch {
      // Not logged in or error — silently ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (productId: number, quantity = 1) => {
      await apiPost("/cart", { productId, quantity });
      await fetchCart();
    },
    [fetchCart]
  );

  const cartProductIds = useMemo(
    () => new Set(cartItems.map((item) => item.productId)),
    [cartItems]
  );

  const isInCart = useCallback(
    (productId: number) => cartProductIds.has(productId),
    [cartProductIds]
  );

  return { cartItems, cartProductIds, loading, addToCart, isInCart, refreshCart: fetchCart };
}
