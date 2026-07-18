"use client";

import { useState } from "react";

interface CartItemProps {
  productId: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  lineTotal: number;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartItemCard({
  productId,
  title,
  price,
  thumbnail,
  quantity,
  lineTotal,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    setRemoving(true);
    onRemove(productId);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="sm:w-40 h-48 sm:h-auto shrink-0">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900 line-clamp-1">
              {title}
            </h2>
            <p className="text-sm text-gray-500 mt-1">₹{price} each</p>
          </div>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpdateQuantity(productId, quantity - 1)}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm font-bold"
              >
                -
              </button>
              <span className="text-sm font-semibold text-gray-900 min-w-[2rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(productId, quantity + 1)}
                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-sm font-bold"
              >
                +
              </button>
            </div>

            {/* Price + Remove */}
            <div className="flex items-center gap-4">
              <span className="text-base font-bold text-gray-900">
                ₹{lineTotal}
              </span>
              <button
                onClick={handleRemove}
                disabled={removing}
                className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline transition-colors disabled:opacity-50"
              >
                {removing ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
