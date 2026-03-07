'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, LogOut, LayoutDashboard, UtensilsCrossed, Menu as MenuIcon } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const cartItems = useCartStore((state) => state.items);
  const [isMounted, setIsMounted] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('userRole');
      setUserRole(null);
      router.push('/login');
    } catch {
      // ignore
    }
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navLink = (href: string, label: string) => {
    const isActive = pathname === href || pathname.startsWith(href + '/');
    return (
      <Link
        href={href}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'text-orange-500 bg-orange-50'
            : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50/50'
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="bg-orange-500 group-hover:bg-orange-600 transition-colors p-2 rounded-xl">
              <UtensilsCrossed className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-gray-900">
              Bite<span className="text-orange-500">Rush</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {userRole === 'admin' ? (
              <>
                {navLink('/admin/dashboard', 'Dashboard')}
                {navLink('/admin/dashboard/products', 'Products')}
                {navLink('/admin/dashboard/orders', 'Orders')}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : userRole === 'customer' ? (
              <>
                {navLink('/products', 'Menu')}
                <Link
                  href="/cart"
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/cart'
                      ? 'text-orange-500 bg-orange-50'
                      : 'text-gray-600 hover:text-orange-500 hover:bg-orange-50/50'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Cart</span>
                  {isMounted && cartItemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                {navLink('/products', 'Menu')}
                <Link
                  href="/login"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
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
