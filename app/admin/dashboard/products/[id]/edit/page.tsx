'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import Link from 'next/link';

const CATEGORIES = ['Burgers', 'Pizza', 'Pakistani', 'Wraps', 'Sides', 'Pasta', 'Desserts', 'Beverages'];
const SPICE_LEVELS = ['', 'mild', 'medium', 'hot', 'extra hot'] as const;

interface FormData {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  stock: string;
  spiceLevel: string;
  prepTime: string;
  isVegetarian: boolean;
  rating: string;
  tags: string; // comma-separated input
}

const inputClass =
  'block w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 bg-white transition';
const labelClass = 'block text-sm font-semibold text-gray-700 mb-1.5';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const isNew = params.id === 'new';

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: '',
    spiceLevel: '',
    prepTime: '',
    isVegetarian: false,
    rating: '',
    tags: '',
  });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isNew) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`/api/products/${params.id}`);
          if (!res.ok) throw new Error('Failed to fetch product');
          const data = await res.json();
          setFormData({
            name: data.name ?? '',
            description: data.description ?? '',
            price: data.price?.toString() ?? '',
            image: data.image ?? '',
            category: data.category ?? '',
            stock: data.stock?.toString() ?? '',
            spiceLevel: data.spiceLevel ?? '',
            prepTime: data.prepTime?.toString() ?? '',
            isVegetarian: data.isVegetarian ?? false,
            rating: data.rating?.toString() ?? '',
            tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          });
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [params.id, isNew]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const tagsArray = formData.tags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const payload: Record<string, any> = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image,
        category: formData.category,
        stock: parseInt(formData.stock, 10),
        isVegetarian: formData.isVegetarian,
        tags: tagsArray,
      };

      if (formData.spiceLevel) payload.spiceLevel = formData.spiceLevel;
      if (formData.prepTime) payload.prepTime = parseInt(formData.prepTime, 10);
      if (formData.rating) payload.rating = parseFloat(formData.rating);

      const url = isNew ? '/api/products' : `/api/products/${params.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }

      router.push('/admin/dashboard/products');
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/admin/dashboard/products"
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 font-medium text-sm w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-8 tracking-tight">
          {isNew ? 'Add New Product' : 'Edit Product'}
        </h1>

        {error && (
          <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass}>Product Name *</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="e.g. Zinger Burger"
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Description *</label>
              <textarea
                name="description"
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className={inputClass + ' resize-none'}
                placeholder="Describe the product..."
              />
            </div>

            <div>
              <label className={labelClass}>Price (Rs.) *</label>
              <input
                type="number"
                name="price"
                required
                min="0"
                step="1"
                value={formData.price}
                onChange={handleChange}
                className={inputClass}
                placeholder="590"
              />
            </div>

            <div>
              <label className={labelClass}>Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                required
                min="0"
                value={formData.stock}
                onChange={handleChange}
                className={inputClass}
                placeholder="50"
              />
            </div>

            <div>
              <label className={labelClass}>Category *</label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className={inputClass}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">Additional Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className={labelClass}>Spice Level</label>
                <select
                  name="spiceLevel"
                  value={formData.spiceLevel}
                  onChange={handleChange}
                  className={inputClass}
                >
                  {SPICE_LEVELS.map((s) => (
                    <option key={s} value={s}>{s === '' ? 'None' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Prep Time (minutes)</label>
                <input
                  type="number"
                  name="prepTime"
                  min="1"
                  value={formData.prepTime}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="20"
                />
              </div>

              <div>
                <label className={labelClass}>Rating (1–5)</label>
                <input
                  type="number"
                  name="rating"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="4.5"
                />
              </div>

              <div>
                <label className={labelClass}>Tags</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="grilled, spicy, desi  (comma-separated)"
                />
              </div>

              <div className="flex items-center gap-3 md:col-span-2 pt-1">
                <input
                  type="checkbox"
                  id="isVegetarian"
                  name="isVegetarian"
                  checked={formData.isVegetarian}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400 cursor-pointer"
                />
                <label htmlFor="isVegetarian" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">
                  Vegetarian
                </label>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {isNew ? 'Create Product' : 'Save Changes'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
