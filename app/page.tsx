'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, UtensilsCrossed, Clock, ShieldCheck, Star } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
}

const CATEGORIES = [
  { label: 'Burgers',    emoji: '🍔', slug: 'Burgers' },
  { label: 'Pizza',      emoji: '🍕', slug: 'Pizza' },
  { label: 'Pakistani',  emoji: '🍛', slug: 'Pakistani' },
  { label: 'Wraps',      emoji: '🌯', slug: 'Wraps' },
  { label: 'Desserts',   emoji: '🍰', slug: 'Desserts' },
  { label: 'Beverages',  emoji: '☕', slug: 'Beverages' },
];

export default function Home() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const role = localStorage.getItem('userRole');
    setUserRole(role);

    // Fetch top 4 products for "Popular" section
    fetch('/api/products')
      .then((r) => r.json())
      .then((data: Product[]) => {
        if (Array.isArray(data)) {
          const sorted = [...data]
            .filter((p) => p.rating)
            .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
            .slice(0, 4);
          setFeatured(sorted);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-white">
      {/* Hero */}
      <section className="bg-orange-50 border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            {isMounted && userRole === 'customer' ? (
              <>
                <p className="text-orange-500 font-semibold text-sm mb-2">Welcome back!</p>
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
                  What are you <br />
                  <span className="text-orange-500">craving today?</span>
                </h1>
                <p className="text-gray-500 text-lg mb-8">
                  Fresh, fast, and delicious — from our kitchen to your door.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-7 py-3.5 rounded-xl text-base font-bold transition-colors shadow-sm"
                  >
                    Browse Menu
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/cart"
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-7 py-3.5 rounded-xl text-base font-bold transition-colors"
                  >
                    View Cart
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-600 font-semibold text-xs mb-6">
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  <span>Fast delivery in Lahore</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-4">
                  Hungry? We've got <br />
                  <span className="text-orange-500">you covered.</span>
                </h1>
                <p className="text-gray-500 text-lg mb-8">
                  Order from your favorite desi restaurant and get it delivered hot and fresh in minutes.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-7 py-3.5 rounded-xl text-base font-bold transition-colors shadow-sm"
                  >
                    Order Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 px-7 py-3.5 rounded-xl text-base font-bold transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">Browse by Category</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-sm transition-all group"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-xs font-semibold text-gray-700 group-hover:text-orange-500 transition-colors">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular This Week */}
      {featured.length > 0 && (
        <section className="py-12 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-extrabold text-gray-900">Popular This Week</h2>
              <Link href="/products" className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1">
                See All <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {featured.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-orange-100 hover:shadow-md transition-all"
                >
                  <div className="relative h-36 bg-gray-50">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No Image</div>
                    )}
                    {product.rating && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {product.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1 mb-0.5">{product.name}</h3>
                    <p className="text-sm font-bold text-orange-500">{formatPrice(product.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="mx-auto h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center mb-5">
                <UtensilsCrossed className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Authentic Pakistani</h3>
              <p className="text-gray-500 text-sm">From karahi to biryani — real desi flavors every time.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="mx-auto h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center mb-5">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-500 text-sm">Hot and fresh at your door. No long waits, no cold food.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="mx-auto h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center mb-5">
                <ShieldCheck className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">Safe & Secure</h3>
              <p className="text-gray-500 text-sm">Your account and orders are always protected.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
