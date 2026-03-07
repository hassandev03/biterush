import Link from 'next/link';
import { ArrowRight, UtensilsCrossed, Clock, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-orange-50/50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm mb-8">
            <UtensilsCrossed className="h-4 w-4" />
            <span>Fastest delivery in town</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
            Hungry? We've got <br className="hidden md:block" />
            <span className="text-orange-500">you covered.</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Order from your favorite restaurants and get it delivered hot and fresh to your door in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
            >
              Order Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-full text-lg font-bold transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="mx-auto h-14 w-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <UtensilsCrossed className="h-7 w-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Best Quality</h3>
              <p className="text-gray-500">We partner with the best restaurants to ensure top-notch food quality.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="mx-auto h-14 w-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
              <p className="text-gray-500">Our delivery partners ensure your food reaches you hot and fresh.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
              <div className="mx-auto h-14 w-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-7 w-7 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Payment</h3>
              <p className="text-gray-500">Your payments are 100% secure with our encrypted payment gateways.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
