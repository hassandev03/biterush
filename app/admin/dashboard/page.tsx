'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, Users, Loader2, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders')
        ]);

        const products = await productsRes.json();
        const orders = await ordersRes.json();

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          orders: Array.isArray(orders) ? orders.length : 0
        });
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="h-16 w-16 bg-orange-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Package className="h-8 w-8 text-orange-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Products</p>
            <p className="text-4xl font-bold text-gray-900">{stats.products}</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
            <p className="text-4xl font-bold text-gray-900">{stats.orders}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/admin/dashboard/products"
          className="group bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all flex items-center justify-between"
        >
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">Manage Products</h3>
            <p className="text-gray-500">Add, edit, or remove items from the menu.</p>
          </div>
          <ArrowRight className="h-6 w-6 text-gray-400 group-hover:text-orange-500 transition-colors" />
        </Link>
      </div>
    </div>
  );
}
