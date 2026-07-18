"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { WishlistItem as WishlistItemType } from "@/types";

interface WishlistItemProps {
  item: WishlistItemType;
  onRemove: (productId: number) => void;
  onMoveToCart: (productId: number) => void;
}

export default function WishlistItemCard({
  item,
  onRemove,
  onMoveToCart,
}: WishlistItemProps) {
  const router = useRouter();
  const [moving, setMoving] = useState(false);

  const handleMoveToCart = async () => {
    setMoving(true);
    onMoveToCart(item.id);
    setTimeout(() => {
      router.push("/cart");
    }, 300);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem]">
          {item.title}
        </h2>
        <p className="text-lg font-bold text-gray-900 mt-2">₹{item.price}</p>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleMoveToCart}
            disabled={moving}
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50"
          >
            {moving ? "Moving..." : "Move to Cart"}
          </button>
          <button
            onClick={() => onRemove(item.id)}
            className="py-2 px-3 rounded-lg text-xs font-semibold bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
