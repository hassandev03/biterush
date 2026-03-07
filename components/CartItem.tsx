'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

interface CartItemProps {
  item: {
    product: {
      _id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const subtotal = item.product.price * item.quantity;

  return (
    <div className="flex items-center gap-4 py-4">
      {/* Product image */}
      <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
        {item.product.image ? (
          <Image
            src={item.product.image}
            alt={item.product.name}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Name + price */}
      <div className="flex-grow min-w-0">
        <h4 className="text-sm font-bold text-gray-900 truncate mb-0.5">{item.product.name}</h4>
        <p className="text-xs text-gray-400">{formatPrice(item.product.price)} each</p>
        <p className="text-sm font-bold text-orange-500 mt-1">{formatPrice(subtotal)}</p>
      </div>

      {/* Quantity controls + remove */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <button
            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-gray-900">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        <button
          onClick={() => removeItem(item.product._id)}
          className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
