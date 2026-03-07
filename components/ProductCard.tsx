'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingCart, Star, Flame, Leaf } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock?: number;
    rating?: number;
    spiceLevel?: string;
    isVegetarian?: boolean;
  };
}

const spiceColors: Record<string, string> = {
  mild: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  hot: 'bg-orange-100 text-orange-700',
  'extra hot': 'bg-red-100 text-red-700',
};

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const isOutOfStock = typeof product.stock === 'number' && product.stock <= 0;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('userRole'));
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isOutOfStock) addItem(product);
  };

  return (
    <Link href={`/products/${product._id}`} className="group block h-full">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-orange-100 transition-all duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-44 w-full bg-gray-50 overflow-hidden flex-shrink-0">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
              No Image
            </div>
          )}

          {/* Rating badge — top left */}
          {product.rating && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-bold text-gray-800 shadow-sm">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              {product.rating.toFixed(1)}
            </div>
          )}

          {/* Category badge — top right */}
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
            {product.category}
          </div>

          {/* Out-of-stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-gray-900 line-clamp-1 flex-1">{product.name}</h3>
            {product.isVegetarian && (
              <span title="Vegetarian">
                <Leaf className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              </span>
            )}
          </div>

          <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-grow leading-relaxed">
            {product.description}
          </p>

          {/* Spice level */}
          {product.spiceLevel && (
            <div className="mb-3">
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${spiceColors[product.spiceLevel] ?? 'bg-gray-100 text-gray-600'}`}>
                <Flame className="h-3 w-3" />
                {product.spiceLevel.charAt(0).toUpperCase() + product.spiceLevel.slice(1)}
              </span>
            </div>
          )}

          {/* Price + Add to Cart */}
          <div className="flex items-center justify-between gap-2 mt-auto">
            <span className="text-base font-bold text-orange-500">{formatPrice(product.price)}</span>
            {isLoggedIn ? (
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="flex items-center gap-1.5 bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white py-1.5 px-3 rounded-xl text-xs font-semibold transition-all border border-orange-100 hover:border-orange-500 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                Add
              </button>
            ) : (
              <Link
                href="/login"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-500 py-1.5 px-3 rounded-xl text-xs font-semibold transition-all border border-gray-200"
              >
                Login to order
              </Link>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
