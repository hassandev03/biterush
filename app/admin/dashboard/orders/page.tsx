'use client';

import { useEffect, useState } from 'react';
import { Loader2, ArrowLeft, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  product: { _id: string; name: string } | null;
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  _id: string;
  customer?: { _id: string; name?: string; email?: string };
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const statusOptions = ['pending', 'confirmed', 'delivered'];

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        const sorted = (Array.isArray(data) ? data : []).sort(
          (a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setOrders(sorted);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdating(null);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4 text-sm font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Orders</h1>
        <p className="mt-1 text-gray-500">
          {orders.length} total order{orders.length !== 1 ? 's' : ''}
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 text-sm">No orders yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Items</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const s = statusConfig[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-600' };
                  const isUpdating = updating === order._id;

                  return (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors align-top">
                      <td className="px-5 py-4 font-mono text-xs text-gray-500 whitespace-nowrap">
                        #{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-5 py-4">
                        {order.customer ? (
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{order.customer.name || 'Customer'}</p>
                            <p className="text-xs text-gray-400">{order.customer.email}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 max-w-[200px]">
                        <div className="space-y-0.5">
                          {order.items.slice(0, 3).map((item, i) => (
                            <p key={i} className="text-xs text-gray-600 truncate">
                              {item.quantity}× {item.product?.name ?? 'Deleted product'}
                            </p>
                          ))}
                          {order.items.length > 3 && (
                            <p className="text-xs text-gray-400">+{order.items.length - 3} more</p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600 whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="relative inline-flex items-center gap-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>{s.label}</span>
                          {order.status !== 'delivered' && (
                            <div className="relative">
                              <select
                                value={order.status}
                                disabled={isUpdating}
                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                className="appearance-none pl-1 pr-4 py-0.5 text-xs text-gray-500 border border-gray-200 rounded-lg bg-white hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-400 cursor-pointer disabled:opacity-50"
                              >
                                {statusOptions.map((s) => (
                                  <option key={s} value={s}>
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" />
                            </div>
                          )}
                          {isUpdating && <Loader2 className="h-3.5 w-3.5 animate-spin text-orange-500" />}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-gray-900 text-right whitespace-nowrap">
                        {formatPrice(order.totalAmount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
