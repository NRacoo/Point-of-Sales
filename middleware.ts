// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseSessionValue } from './lib/interface/auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionCookie = request.cookies.get('session')?.value;
  const session = parseSessionValue(sessionCookie);

  const isAdminRoute = pathname.startsWith('/admin');
  const isCashierRoute = pathname.startsWith('/cashier');

  if (isAdminRoute || isCashierRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAdminRoute && session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/cashier', request.url));
    }

    if (isCashierRoute && session.role !== 'CASHIER' && session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (pathname === '/login' && session) {
    return NextResponse.redirect(
      new URL(session.role === 'ADMIN' ? '/admin' : '/cashier', request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/cashier/:path*', '/login'],
};
