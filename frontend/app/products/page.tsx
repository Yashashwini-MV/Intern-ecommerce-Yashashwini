"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center mb-10">
        Products
      </h1>

      <div className="grid grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md p-4"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-52 object-cover rounded-lg"
            />

            <h2 className="text-lg font-semibold mt-4">
              {product.title}
            </h2>

            <p className="text-green-600 font-bold mt-2">
              ₹ {product.price}
            </p>

            <button className="w-full bg-pink-500 text-white py-2 rounded-lg mt-4">
              ❤️ Wishlist
            </button>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-3">
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
