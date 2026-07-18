"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/types";
import { getDiscountedPrice } from "@/lib/api";
import StarRating from "./StarRating";

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  onAddToWishlist: (productId: number) => void;
  onAddToCart: (productId: number) => void;
}

export default function ProductCard({
  product,
  isWishlisted,
  onAddToWishlist,
  onAddToCart,
}: ProductCardProps) {
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const discountedPrice = getDiscountedPrice(product.price, product.discountPercentage);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted || wishlistLoading) return;
    setWishlistLoading(true);
    onAddToWishlist(product.id);
    setWishlistLoading(false);
  };

  const handleCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartLoading) return;
    setCartLoading(true);
    onAddToCart(product.id);
    setCartLoading(false);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 hover:-translate-y-1">
        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discountPercentage > 0 && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
            {product.category}
          </span>

          <h2 className="text-sm font-semibold text-gray-800 mt-1 line-clamp-2 min-h-[2.5rem] group-hover:text-indigo-600 transition-colors">
            {product.title}
          </h2>

          <div className="mt-2">
            <StarRating rating={product.rating} />
          </div>

          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-xl font-bold text-gray-900">
              ₹{discountedPrice}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.price}
              </span>
            )}
          </div>

          <p
            className={`text-xs font-medium mt-1.5 ${
              product.stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleWishlist}
              disabled={isWishlisted || wishlistLoading}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                isWishlisted
                  ? "bg-pink-100 text-pink-500 cursor-default"
                  : "bg-pink-50 text-pink-600 hover:bg-pink-500 hover:text-white"
              }`}
            >
              {isWishlisted ? "Wishlisted" : "Wishlist"}
            </button>
            <button
              onClick={handleCart}
              disabled={cartLoading}
              className="flex-1 py-2 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
            >
              {cartLoading ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
