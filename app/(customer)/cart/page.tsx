'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import CartItem from '@/components/CartItem';

export default function CartPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const total = getTotal();

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    
    setLoading(true);
    setError('');

    try {
      const orderItems = items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        priceAtPurchase: item.product.price
      }));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: orderItems, totalAmount: total }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      setSuccess(true);
      clearCart();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed!</h2>
          <p className="text-gray-500 mb-8">
            Your order has been successfully placed and is being processed.
          </p>
          <Link 
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-8">Your Cart</h1>

      {error && (
        <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="mx-auto h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
          <Link 
            href="/products"
            className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <CartItem key={item.product._id} item={item} />
              ))}
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 sm:p-8 border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-medium text-gray-600">Total Amount</span>
              <span className="text-3xl font-bold text-gray-900">${total.toFixed(2)}</span>
            </div>
            
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Place Order
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
