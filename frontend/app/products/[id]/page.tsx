"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/types";
import { apiGet, apiPost, getDiscountedPrice } from "@/lib/api";
import { useRequireAuth } from "@/lib/hooks";
import StarRating from "@/app/components/StarRating";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { checkAuth } = useRequireAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiGet<Product>(`/products/${id}`);
        setProduct(data);
        setSelectedImage(data.thumbnail);
      } catch {
        console.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!product) return;
      try {
        const data = await apiGet<Product[]>("/wishlist", true);
        setWishlisted(data.some((item) => item.id === product.id));
      } catch {
        // not logged in or error
      }
    };

    checkWishlist();
  }, [product]);

  const addToWishlist = async () => {
    if (!checkAuth()) return;
    setWishlistLoading(true);
    try {
      await apiPost("/wishlist", { productId: product?.id });
      setWishlisted(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add to wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const addToCart = async () => {
    if (!checkAuth()) return;
    setCartLoading(true);
    try {
      await apiPost("/cart", { productId: product?.id, quantity });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-40 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 rounded-2xl h-96" />
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-8 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-20 bg-gray-200 rounded" />
                <div className="h-10 bg-gray-200 rounded w-48" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-700">
            Product not found
          </h2>
          <Link
            href="/products"
            className="mt-4 inline-block text-indigo-600 hover:text-indigo-700 font-medium"
          >
            &larr; Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 text-sm font-medium mb-6 transition-colors group"
        >
          <svg
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </Link>

        {/* Product Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="w-full h-72 sm:h-80 lg:h-[28rem] object-cover rounded-xl"
                />
                {product.discountPercentage > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow">
                    -{Math.round(product.discountPercentage)}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === img
                          ? "border-indigo-500 ring-2 ring-indigo-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-4 sm:p-6 lg:p-8 lg:border-l border-gray-100">
              {/* Category */}
              <span className="inline-block text-xs font-semibold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full">
                {product.category}
              </span>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-3">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="mt-3">
                <StarRating rating={product.rating} size="md" />
              </div>

              {/* Description */}
              <p className="text-gray-600 mt-4 leading-relaxed text-sm sm:text-base">
                {product.description}
              </p>

              {/* Price Section */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                    ₹{discountedPrice}
                  </span>
                  {product.discountPercentage > 0 && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        ₹{product.price}
                      </span>
                      <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        Save ₹
                        {(
                          product.price -
                          product.price * (1 - product.discountPercentage / 100)
                        ).toFixed(0)}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Stock */}
              <div className="mt-4 flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    product.stock > 0 ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    product.stock > 0 ? "text-green-700" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `In Stock — ${product.stock} units available`
                    : "Out of Stock"}
                </span>
              </div>

              {/* Quantity Selector */}
              {product.stock > 0 && (
                <div className="mt-5 flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-sm font-semibold text-gray-900 min-w-[3rem] text-center border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={addToWishlist}
                  disabled={wishlisted || wishlistLoading}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    wishlisted
                      ? "bg-pink-100 text-pink-500 cursor-default border border-pink-200"
                      : "bg-white text-pink-600 border-2 border-pink-300 hover:bg-pink-500 hover:text-white hover:border-pink-500"
                  } disabled:opacity-50`}
                >
                  <svg
                    className="w-5 h-5"
                    fill={wishlisted ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {wishlisted ? "Wishlisted" : "Add to Wishlist"}
                </button>

                <button
                  onClick={addToCart}
                  disabled={product.stock === 0 || cartLoading}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    product.stock === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-xl hover:shadow-indigo-300"
                  } disabled:opacity-50`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                    />
                  </svg>
                  {cartLoading ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
