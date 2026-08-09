"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useSearchLoading } from "@/lib/search-context";

interface SearchBarProps {
  className?: string;
}

function SearchBarInner({ className = "" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") || "";
  const { searchLoading, setSearchLoading } = useSearchLoading();

  const [inputValue, setInputValue] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(initialQuery);
  }, [initialQuery]);

  const updateURL = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (trimmed) {
        router.push(`/products?search=${encodeURIComponent(trimmed)}`, {
          scroll: false,
        });
      } else {
        router.push("/products", { scroll: false });
      }
    },
    [router]
  );

  const triggerSearch = useCallback(
    (value: string) => {
      setSearchLoading(true);
      updateURL(value);
    },
    [setSearchLoading, updateURL]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      triggerSearch(inputValue);
    },
    [inputValue, triggerSearch]
  );

  const handleClear = useCallback(() => {
    setInputValue("");
    triggerSearch("");
    inputRef.current?.focus();
  }, [triggerSearch]);

  const handleSearchIconClick = useCallback(() => {
    triggerSearch(inputValue);
  }, [inputValue, triggerSearch]);

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
          {searchLoading ? (
            <svg
              className="animate-spin h-4 w-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <button
              type="button"
              onClick={handleSearchIconClick}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search products..."
          value={inputValue}
          onChange={handleChange}
          disabled={searchLoading}
          className="w-full pl-10 pr-10 py-2 rounded-full bg-white/90 text-gray-800 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />

        {inputValue && !searchLoading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
}

export default function SearchBar(props: SearchBarProps) {
  return (
    <Suspense fallback={<div className={props.className} />}>
      <SearchBarInner {...props} />
    </Suspense>
  );
}
