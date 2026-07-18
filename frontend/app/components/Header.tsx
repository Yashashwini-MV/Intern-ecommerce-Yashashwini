"use client";

import Link from "next/link";
import { useState } from "react";
import SearchBar from "./SearchBar";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight shrink-0"
          >
            Shop<span className="text-yellow-300">Ease</span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 ml-6">
            <Link
              href="/"
              className="text-white/90 hover:text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-white/90 hover:text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Products
            </Link>
          </nav>

          {/* Desktop Search Bar */}
          <SearchBar className="hidden md:flex flex-1 max-w-md mx-4" />

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/wishlist"
              className="text-white/90 hover:text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Wishlist
            </Link>
            <Link
              href="/cart"
              className="text-white/90 hover:text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              Cart
            </Link>
            <div className="w-px h-6 bg-white/30 mx-1" />
            <Link
              href="/login"
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-yellow-300 text-indigo-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-200 transition-colors"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/20 mt-2 pt-3">
            {/* Mobile Search */}
            <div className="mb-3" onClick={() => setMobileOpen(false)}>
              <SearchBar className="w-full" />
            </div>

            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Products
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileOpen(false)}
                className="text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Wishlist
              </Link>
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="text-white px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Cart
              </Link>
              <div className="h-px bg-white/20 my-2" />
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="bg-white text-indigo-600 px-4 py-2.5 rounded-lg text-sm font-semibold text-center hover:bg-indigo-50 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="bg-yellow-300 text-indigo-900 px-4 py-2.5 rounded-lg text-sm font-semibold text-center hover:bg-yellow-200 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
