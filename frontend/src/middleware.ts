import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Define protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/sales', '/purchases', '/products', '/stock', '/returns'];
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    const accessToken = request.cookies.get('accessToken')?.value;
    const refreshToken = request.cookies.get('refreshToken')?.value;
    
    // If neither token exists, redirect to login
    if (!accessToken && !refreshToken) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Define auth routes that authenticated users shouldn't access (like login)
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.some(route => pathname === route);
  
  if (isAuthRoute) {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    // If user has a refresh token, assume they are logged in and redirect to dashboard
    if (refreshToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
