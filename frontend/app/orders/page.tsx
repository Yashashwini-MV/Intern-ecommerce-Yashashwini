"use client";

import Link from "next/link";

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Order Placed!
        </h1>
        <p className="text-gray-500 mb-6">
          Thank you for shopping with us.
        </p>

        <div className="bg-gray-50 rounded-xl p-5 mb-8">
          <p className="text-sm text-gray-500">
            Estimated Delivery
          </p>
          <p className="text-xl font-bold text-indigo-600 mt-1">
            3 - 5 Business Days
          </p>
        </div>

        <Link
          href="/products"
          className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
