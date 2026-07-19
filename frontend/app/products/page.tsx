"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/types";
import { apiGet, apiPost } from "@/lib/api";
import { useRequireAuth, useCartItems } from "@/lib/hooks";
import ProductCard from "@/app/components/ProductCard";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { checkAuth } = useRequireAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [wishlisted, setWishlisted] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const cart = useCartItems();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiGet<{ products: Product[] }>("/products");
        setProducts(data.products);
      } catch {
        console.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    const loadWishlist = async () => {
      try {
        const data = await apiGet<Product[]>("/wishlist", true);
        setWishlisted(data.map((item) => item.id));
      } catch {
        // not logged in or error — silently ignore
      }
    };

    load();
    loadWishlist();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const addToWishlist = async (productId: number) => {
    if (!checkAuth()) return;
      try {
        await apiPost<{ message: string }>("/wishlist", { productId });
        setWishlisted((prev) => [...prev, productId]);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add to wishlist");
    }
  };

  const addToCart = async (productId: number) => {
    if (!checkAuth()) return;
    try {
      await cart.addToCart(productId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add to cart");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            {searchQuery ? (
              <>
                Results for &quot;<span className="text-indigo-600">{searchQuery}</span>&quot;
              </>
            ) : (
              "All Products"
            )}
          </h1>
          {!loading && (
            <p className="mt-2 text-gray-500 text-sm">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse"
              >
                <div className="h-52 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-700">
              No products found
            </h3>
            <p className="mt-1 text-gray-500">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlisted.includes(product.id)}
                inCart={cart.isInCart(product.id)}
                onAddToWishlist={addToWishlist}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
