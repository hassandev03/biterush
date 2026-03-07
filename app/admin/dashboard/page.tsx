'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, TrendingUp, Users, Loader2, AlertTriangle, ArrowRight, Plus, ClipboardList } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Product {
  _id: string;
  name: string;
  stock: number;
  category: string;
}

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  customer?: { _id: string; name?: string; email?: string };
  items?: { product: { name: string } | null; quantity: number }[];
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
};

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders'),
        ]);
        const productsData = await productsRes.json();
        const ordersData = await ordersRes.json();
        setProducts(Array.isArray(productsData) ? productsData : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const uniqueCustomers = new Set(orders.map((o) => o.customer?._id).filter(Boolean)).size;
  const lowStockProducts = products.filter((p) => p.stock < 10);
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-500',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: ShoppingBag,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
    },
    {
      label: 'Total Revenue',
      value: formatPrice(totalRevenue),
      icon: TrendingUp,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-500',
    },
    {
      label: 'Customers',
      value: uniqueCustomers,
      icon: Users,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
        <p className="mt-1 text-gray-500">Overview of your restaurant operations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className={`h-12 w-12 ${stat.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Recent Orders</h2>
            <Link href="/admin/dashboard/orders" className="text-sm font-semibold text-orange-500 hover:text-orange-600 flex items-center gap-1">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">No orders yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => {
                    const s = statusConfig[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-600' };
                    return (
                      <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3 font-mono text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</td>
                        <td className="px-5 py-3 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>{s.label}</span>
                        </td>
                        <td className="px-5 py-3 text-sm font-bold text-gray-900 text-right">{formatPrice(order.totalAmount)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link
                href="/admin/dashboard/products/new/edit"
                className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add New Product
              </Link>
              <Link
                href="/admin/dashboard/orders"
                className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-sm transition-colors"
              >
                <ClipboardList className="h-4 w-4" />
                View All Orders
              </Link>
              <Link
                href="/admin/dashboard/products"
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-sm transition-colors"
              >
                <Package className="h-4 w-4" />
                Manage Products
              </Link>
            </div>
          </div>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <div className="bg-white rounded-2xl border border-orange-200 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <h2 className="text-base font-bold text-gray-900">Low Stock Alert</h2>
                <span className="ml-auto bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {lowStockProducts.length}
                </span>
              </div>
              <div className="space-y-2">
                {lowStockProducts.slice(0, 5).map((p) => (
                  <Link
                    key={p._id}
                    href={`/admin/dashboard/products/${p._id}/edit`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600 truncate">{p.name}</span>
                    <span className={`ml-2 flex-shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${p.stock <= 0 ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                      {p.stock <= 0 ? 'Out' : `${p.stock} left`}
                    </span>
                  </Link>
                ))}
                {lowStockProducts.length > 5 && (
                  <p className="text-xs text-gray-400 text-center pt-1">+{lowStockProducts.length - 5} more</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
