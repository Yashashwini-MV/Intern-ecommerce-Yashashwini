"use client";

import Link from "next/link";

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-8">

      <div className="bg-white shadow-xl rounded-xl p-10 w-[600px] text-center">

        <h1 className="text-5xl font-bold text-green-600 mb-6">
          🎉 Order Placed!
        </h1>

        <p className="text-xl text-gray-700 mb-4">
          Thank you for shopping with us.
        </p>

        <p className="text-gray-600 mb-8">
          Your order has been placed successfully.
        </p>

        <div className="bg-gray-100 rounded-lg p-5 mb-8">
          <p className="text-lg">
            🚚 Estimated Delivery:
          </p>

          <p className="text-2xl font-bold text-blue-600 mt-2">
            3 - 5 Business Days
          </p>
        </div>

        <Link
          href="/products"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
        >
          Continue Shopping
        </Link>

      </div>

    </main>
  );
}