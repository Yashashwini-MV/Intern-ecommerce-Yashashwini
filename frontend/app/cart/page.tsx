"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  productId: number;
  title: string;
  price: number;
 thumbnail: string;
  quantity: number;
  lineTotal: number;
}

export default function CartPage() {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);

  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data);
      } else {
        alert(data.message || "Failed to load cart.");
      }
    } catch (error) {
      console.error(error);
      alert("Cannot connect to backend.");
    }
  };

  const updateQuantity = async (
    productId: number,
    quantity: number
  ) => {
    const token = localStorage.getItem("token");

    if (quantity < 1) return;

    try {
      const response = await fetch(
        `http://localhost:3000/cart/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quantity,
          }),
        }
      );

      if (response.ok) {
        setCart((prev) =>
          prev.map((item) =>
            item.productId === productId
              ? {
                  ...item,
                  quantity,
                  lineTotal: item.price * quantity,
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeFromCart = async (productId: number) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:3000/cart/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCart((prev) =>
          prev.filter((item) => item.productId !== productId)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.lineTotal,
    0
  );

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
        🛒 My Cart
      </h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">
          Your cart is empty.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-6">

            {cart.map((item) => (

              <div
                key={item.productId}
                className="bg-white rounded-xl shadow-md p-4"
              >

                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-52 object-cover rounded-lg"
                />

                <h2 className="text-lg font-semibold text-gray-900 mt-4">
                  {item.title}
                </h2>

                <p className="text-green-600 font-bold mt-2">
                  ₹ {item.price}
                </p>

                <div className="flex justify-center items-center gap-4 mt-4">

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.quantity - 1
                      )
                    }
                    className="bg-gray-300 px-3 py-1 rounded"
                  >
                    -
                  </button>

                  <span className="text-xl font-bold text-gray-900">
  {item.quantity}
</span>

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.quantity + 1
                      )
                    }
                    className="bg-gray-300 text-gray-900 font-bold px-3 py-1 rounded hover:bg-gray-400"
                  >
                    +
                  </button>

                </div>

                <p className="font-bold text-gray-900 mt-4">
                  Subtotal: ₹ {item.lineTotal}
                </p>

                <button
                  onClick={() =>
                    removeFromCart(item.productId)
                  }
                  className="w-full bg-red-500 text-white py-2 rounded-lg mt-4 hover:bg-red-600"
                >
                  Remove
                </button>

              </div>

            ))}

          </div>

          <div className="mt-10 bg-white rounded-xl shadow-md p-6">

            <h2 className="text-2xl font-bold text-gray-900">
              Total: ₹ {total}
            </h2>

            <button
  onClick={() => router.push("/address")}
  className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
>
  Proceed to Address
</button>

          </div>
        </>
      )}
    </main>
  );
}