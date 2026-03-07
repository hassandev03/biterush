import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth } from './lib/auth';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const { pathname } = req.nextUrl;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    try {
      const payload = await verifyAuth(token);
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/products', req.url));
      }
    } catch (err) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Protect /cart route
  if (pathname.startsWith('/cart')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    try {
      await verifyAuth(token);
    } catch (err) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/cart'],
};
