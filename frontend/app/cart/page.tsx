"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CartItem } from "@/types";
import { apiGet, apiPatch, apiDelete } from "@/lib/api";
import CartItemCard from "@/app/components/CartItemCard";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiGet<CartItem[]>("/cart", true);
        if (!cancelled) setCart(data);
      } catch (err) {
        if (!cancelled) {
          if (err instanceof Error && err.message === "NOT_AUTHENTICATED") {
            alert("Please login first.");
            router.push("/login");
            return;
          }
          setError(err instanceof Error ? err.message : "Failed to load cart");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  const updateQuantity = async (productId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await apiPatch(`/cart/${productId}`, { quantity });
      setCart((prev) =>
        prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity, lineTotal: item.price * quantity }
            : item
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      await apiDelete(`/cart/${productId}`);
      setCart((prev) => prev.filter((item) => item.productId !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.lineTotal, 0);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 flex gap-4">
                <div className="w-40 h-48 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-8 bg-gray-200 rounded w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          My Cart
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <svg
              className="mx-auto h-16 w-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-700">
              Your cart is empty
            </h3>
            <p className="mt-1 text-gray-500">
              Add some products to get started.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {cart.map((item) => (
              <CartItemCard
                key={item.productId}
                productId={item.productId}
                title={item.title}
                price={item.price}
                thumbnail={item.thumbnail}
                quantity={item.quantity}
                lineTotal={item.lineTotal}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}

            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-medium">Subtotal</span>
                <span className="text-xl font-bold text-gray-900">₹{total}</span>
              </div>
              <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">₹{total}</span>
              </div>
              <button
                onClick={() => router.push("/address")}
                className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
