"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { WishlistItem } from "@/types";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import WishlistItemCard from "@/app/components/WishlistItemCard";

export default function WishlistPage() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiGet<WishlistItem[]>("/wishlist", true);
        if (!cancelled) setWishlist(data);
      } catch (err) {
        if (!cancelled) {
          if (err instanceof Error && err.message === "NOT_AUTHENTICATED") {
            alert("Please login first.");
            router.push("/login");
            return;
          }
          setError(err instanceof Error ? err.message : "Failed to load wishlist");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  const removeFromWishlist = async (productId: number) => {
    try {
      await apiDelete(`/wishlist/${productId}`);
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  const moveToCart = async (productId: number) => {
    try {
      await apiPost("/cart", { productId, quantity: 1 });
      await apiDelete(`/wishlist/${productId}`);
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to move to cart");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-6 bg-gray-200 rounded w-1/4" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          My Wishlist
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
            {error}
          </div>
        )}

        {wishlist.length === 0 ? (
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-700">
              Your wishlist is empty
            </h3>
            <p className="mt-1 text-gray-500">
              Browse products and save your favorites.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((item) => (
              <WishlistItemCard
                key={item.id}
                item={item}
                onRemove={removeFromWishlist}
                onMoveToCart={moveToCart}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
