"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className = "" }: SearchBarProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const query = search.trim();
      if (query) {
        router.push(`/products?search=${encodeURIComponent(query)}`);
      } else {
        router.push("/products");
      }
    },
    [search, router]
  );

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-4 pr-10 py-2 rounded-full bg-white/90 text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:bg-white transition-all"
        />
        <button
          type="submit"
          className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
}
