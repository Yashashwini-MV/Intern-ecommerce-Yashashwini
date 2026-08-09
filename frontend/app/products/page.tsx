"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type { Product, PaginatedProducts } from "@/types";
import { apiGet, apiPost } from "@/lib/api";
import { useRequireAuth, useCartItems } from "@/lib/hooks";
import { useSearchLoading } from "@/lib/search-context";
import ProductCard from "@/app/components/ProductCard";

const PAGE_SIZE = 10;
const DUMMYJSON_API = "https://dummyjson.com/products";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const { checkAuth } = useRequireAuth();
  const { setSearchLoading } = useSearchLoading();
  const productsTopRef = useRef<HTMLDivElement>(null);
  const prevSearchQuery = useRef(searchQuery);

  const [products, setProducts] = useState<Product[]>([]);
  const [wishlisted, setWishlisted] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageLoading, setPageLoading] = useState(false);
  const cart = useCartItems();

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const scrollToTop = useCallback(() => {
    productsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const fetchProducts = useCallback(
    async (page: number, query: string, signal?: AbortSignal) => {
      setPageLoading(true);
      try {
        const skip = (page - 1) * PAGE_SIZE;
        const params = `limit=${PAGE_SIZE}&skip=${skip}`;
        const url = query
          ? `${DUMMYJSON_API}/search?q=${encodeURIComponent(query)}&${params}`
          : `${DUMMYJSON_API}?${params}`;
        const res = await fetch(url, { signal });
        if (!res.ok) throw new Error("Failed to fetch products");
        const data: PaginatedProducts = await res.json();
        setProducts(data.products);
        setTotalItems(data.total);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Failed to load products");
      } finally {
        setPageLoading(false);
        setLoading(false);
        setSearchLoading(false);
      }
    },
    [setSearchLoading]
  );

  useEffect(() => {
    const controller = new AbortController();

    if (searchQuery !== prevSearchQuery.current) {
      prevSearchQuery.current = searchQuery;
      if (currentPage !== 1) {
        setCurrentPage(1);
        return;
      }
    }
    fetchProducts(currentPage, searchQuery, controller.signal);

    return () => controller.abort();
  }, [currentPage, searchQuery, fetchProducts]);

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const data = await apiGet<Product[]>("/wishlist", true);
        setWishlisted(data.map((item) => item.id));
      } catch {
        // not logged in or error — silently ignore
      }
    };
    loadWishlist();
  }, []);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
    scrollToTop();
  };

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

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const startItem = (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, totalItems);

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
              {searchQuery
                ? `${totalItems} result${totalItems !== 1 ? "s" : ""} found`
                : `${totalItems} product${totalItems !== 1 ? "s" : ""} total`}
              {!searchQuery && totalPages > 1 && (
                <span className="ml-2">
                  &middot; Page {currentPage} of {totalPages}
                  <span className="ml-2 text-gray-400">
                    (showing {startItem}&ndash;{endItem})
                  </span>
                </span>
              )}
            </p>
          )}
        </div>

        {/* Products Top Anchor */}
        <div ref={productsTopRef} />

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
        ) : products.length === 0 ? (
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
              Try searching with another keyword.
            </p>
          </div>
        ) : (
          <>
            {/* Page Change Loading Overlay */}
            {pageLoading && (
              <div className="flex justify-center py-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading page {currentPage}...
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 transition-opacity ${pageLoading ? "opacity-50" : ""}`}>
              {products.map((product) => (
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center gap-4">
                <nav className="flex items-center gap-1" aria-label="Pagination">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </span>
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-3 py-2 text-sm font-medium text-gray-500"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-indigo-600 text-white shadow-sm"
                            : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      Next
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </nav>

                {/* Page Info */}
                <p className="text-sm text-gray-500">
                  Showing {startItem} &ndash; {endItem} of {totalItems} products
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
