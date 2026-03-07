'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, LogOut, LayoutDashboard, UtensilsCrossed } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const [isMounted, setIsMounted] = useState(false);
  
  // Simple auth state check based on cookies/localStorage (in a real app, use Context/Provider)
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    // Check local storage for role set during login
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, [pathname]); // Re-run when path changes

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('userRole');
      setUserRole(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-orange-500 p-2 rounded-lg">
                <UtensilsCrossed className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">BiteRush</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {userRole === 'admin' ? (
              <>
                <Link href="/admin/dashboard" className="text-gray-600 hover:text-orange-500 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-gray-600 hover:text-red-500 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : userRole === 'customer' ? (
              <>
                <Link href="/products" className="text-gray-600 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Menu
                </Link>
                <Link href="/cart" className="text-gray-600 hover:text-orange-500 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors relative">
                  <ShoppingCart className="h-5 w-5" />
                  {isMounted && cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <button onClick={handleLogout} className="text-gray-600 hover:text-red-500 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
