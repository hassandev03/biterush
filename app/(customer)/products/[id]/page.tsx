'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, ArrowLeft, Loader2, Star, Flame, Leaf, Clock, Tag } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating?: number;
  spiceLevel?: string;
  prepTime?: number;
  isVegetarian?: boolean;
  tags?: string[];
}

const spiceConfig: Record<string, { label: string; color: string; bg: string }> = {
  mild:       { label: 'Mild',       color: 'text-green-700',  bg: 'bg-green-50 border-green-200' },
  medium:     { label: 'Medium',     color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  hot:        { label: 'Hot',        color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
  'extra hot':{ label: 'Extra Hot',  color: 'text-red-700',    bg: 'bg-red-50 border-red-200' },
};

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">Out of Stock</span>;
  if (stock < 10) return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-200">Low Stock — {stock} left</span>;
  return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-200">In Stock</span>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('userRole'));
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 bg-red-50 px-4 py-3 rounded-xl font-medium">{error || 'Product not found'}</div>
        <button onClick={() => router.push('/products')} className="text-orange-500 hover:underline font-medium">
          Back to Menu
        </button>
      </div>
    );
  }

  const spice = product.spiceLevel ? spiceConfig[product.spiceLevel] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => router.push('/products')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 font-medium text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Menu
      </button>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative h-64 md:h-full min-h-[400px] bg-gray-50">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
            )}
            {/* Category badge */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-gray-700 shadow-sm">
              {product.category}
            </div>
            {/* Veg badge */}
            {product.isVegetarian && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Leaf className="h-3 w-3" /> Veg
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8 md:p-10 flex flex-col">
            <div className="flex-grow">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">{product.name}</h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-1.5 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <Star
                      key={s}
                      className={`h-4 w-4 ${s <= Math.round(product.rating!) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                  <span className="text-sm font-semibold text-gray-700 ml-1">{product.rating.toFixed(1)}</span>
                </div>
              )}

              <p className="text-2xl font-bold text-orange-500 mb-5">{formatPrice(product.price)}</p>

              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Details row */}
              <div className="flex flex-wrap gap-3 mb-6">
                {spice && (
                  <span className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl border ${spice.bg} ${spice.color}`}>
                    <Flame className="h-3.5 w-3.5" />
                    {spice.label}
                  </span>
                )}
                {product.prepTime && (
                  <span className="flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-xl border bg-gray-50 border-gray-200 text-gray-600">
                    <Clock className="h-3.5 w-3.5" />
                    ~{product.prepTime} min
                  </span>
                )}
              </div>
            </div>

            {/* Bottom section */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Availability</span>
                <StockBadge stock={product.stock} />
              </div>

              {isLoggedIn ? (
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-bold transition-all ${
                    added
                      ? 'bg-green-500 text-white'
                      : product.stock <= 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {added ? 'Added to Cart!' : product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-base font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Login to Order
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
