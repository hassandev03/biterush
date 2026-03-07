'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, ShoppingBag, ArrowRight, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  product: { _id: string; name: string } | null;
  quantity: number;
  priceAtPurchase: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:   { label: 'Pending',   color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        if (!res.ok) {
          if (res.status === 401) {
            setError('Please log in to view your orders.');
            return;
          }
          throw new Error('Failed to fetch orders');
        }
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

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-4">
        <div className="text-red-500 bg-red-50 px-4 py-3 rounded-xl font-medium">{error}</div>
        <Link href="/login" className="text-orange-500 hover:underline font-medium text-sm">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Orders</h1>
        <p className="mt-1 text-gray-500">
          {orders.length === 0
            ? 'No orders yet.'
            : `${orders.length} order${orders.length !== 1 ? 's' : ''} placed`}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 mb-6 text-sm">Your order history will appear here.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors text-sm"
          >
            Browse Menu
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const s = statusConfig[order.status] ?? { label: order.status, color: 'bg-gray-100 text-gray-600' };
            return (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Order header */}
                <div className="px-5 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-PK', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>
                      {s.label}
                    </span>
                    <span className="text-base font-extrabold text-gray-900">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Order items */}
                <div className="px-5 py-3 divide-y divide-gray-50">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">
                          {item.product?.name ?? 'Deleted product'}
                        </span>
                        <span className="text-xs text-gray-400">× {item.quantity}</span>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">
                        {formatPrice(item.priceAtPurchase * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
