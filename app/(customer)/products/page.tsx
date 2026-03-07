'use client';

import { useEffect, useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { Loader2, Search, X } from 'lucide-react';

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
  isVegetarian?: boolean;
  tags?: string[];
}

const CATEGORY_ICONS: Record<string, string> = {
  All: '🍽️',
  Burgers: '🍔',
  Pizza: '🍕',
  Pakistani: '🍛',
  Wraps: '🌯',
  Sides: '🍟',
  Pasta: '🍝',
  Desserts: '🍰',
  Beverages: '☕',
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Derive categories from product data
  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category))).sort();
    return ['All', ...cats];
  }, [products]);

  // Client-side filtering
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [products, search, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-red-500 bg-red-50 px-4 py-3 rounded-xl font-medium">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Our Menu</h1>
        <p className="mt-1 text-gray-500">Fresh, fast, and delicious — order right away.</p>
      </div>

      {/* Search + Filter bar */}
      <div className="mb-6 space-y-4">
        {/* Search input */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, ingredient, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-500'
              }`}
            >
              <span>{CATEGORY_ICONS[cat] ?? '🍽️'}</span>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Result count */}
      <p className="text-sm text-gray-400 mb-5">
        Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of{' '}
        <span className="font-semibold text-gray-700">{products.length}</span> items
        {selectedCategory !== 'All' && (
          <span> in <span className="text-orange-500 font-semibold">{selectedCategory}</span></span>
        )}
        {search && (
          <span> for <span className="text-orange-500 font-semibold">"{search}"</span></span>
        )}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <p className="text-4xl mb-3">🔍</p>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No items found</h3>
          <p className="text-gray-500 text-sm">
            Try a different search term or category.
          </p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('All'); }}
            className="mt-4 text-orange-500 hover:underline text-sm font-medium"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
