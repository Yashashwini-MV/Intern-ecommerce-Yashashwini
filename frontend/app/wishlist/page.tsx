"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);

  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/wishlist", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setWishlist(data);
      } else {
        alert(data.message || "Failed to load wishlist.");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend.");
    }
  };

  const removeFromWishlist = async (productId: number) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3000/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
  setWishlist((prev) =>
    prev.filter((product) => product.id !== productId)
  );
} else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend.");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
>
        ❤️ My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-gray-600">
          Your wishlist is empty.
        </p>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {wishlist.map((product) => (
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
                onClick={() => removeFromWishlist(product.id)}
                className="w-full bg-red-500 text-white py-2 rounded-lg mt-4 hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
