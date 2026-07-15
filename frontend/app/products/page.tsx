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
  const [wishlisted, setWishlisted] = useState<number[]>([]);

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/products");
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch wishlist from backend
  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Store only product IDs
        setWishlisted(data.map((item: Product) => item.id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const addToWishlist = async (productId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setWishlisted((prev) => [...prev, productId]);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-end mb-6">
        <a
          href="/wishlist"
          className="bg-pink-500 text-white px-5 py-2 rounded-lg hover:bg-pink-600"
        >
          ❤️ View Wishlist
        </a>
      </div>

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

            <button
              onClick={() => addToWishlist(product.id)}
              disabled={wishlisted.includes(product.id)}
              className={`w-full py-2 rounded-lg mt-4 text-white ${
                wishlisted.includes(product.id)
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-pink-500 hover:bg-pink-600"
              }`}
            >
              {wishlisted.includes(product.id)
                ? "❤️ Wishlisted"
                : "❤️ Wishlist"}
            </button>

            <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-3 hover:bg-blue-700">
              🛒 Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}