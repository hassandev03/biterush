'use client';

import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/lib/store';

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

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
        {item.product.image ? (
          <Image
            src={item.product.image}
            alt={item.product.name}
            fill
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            No Image
          </div>
        )}
      </div>

      <div className="flex-grow min-w-0">
        <h4 className="text-base font-semibold text-gray-900 truncate">{item.product.name}</h4>
        <p className="text-sm font-medium text-orange-500">${item.product.price.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
          <button
            onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-2 text-gray-500 hover:text-gray-900 disabled:opacity-50 transition-colors"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-8 text-center text-sm font-medium text-gray-900">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
            className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>

        <button
          onClick={() => removeItem(item.product._id)}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
