'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/store';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating if clicking the button inside the Link
    addItem(product);
  };

  return (
    <Link href={`/products/${product._id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
        <div className="relative h-48 w-full bg-gray-50 overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-gray-700 shadow-sm">
            {product.category}
          </div>
        </div>
        
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h3>
            <span className="font-bold text-orange-500">${product.price.toFixed(2)}</span>
          </div>
          
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
            {product.description}
          </p>
          
          <button 
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-orange-50 text-gray-900 hover:text-orange-600 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-gray-100 hover:border-orange-200"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
