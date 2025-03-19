import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Log all API requests
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(`[${new Date().toISOString()}] ${request.method} ${request.nextUrl.pathname}${request.nextUrl.search}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}; 