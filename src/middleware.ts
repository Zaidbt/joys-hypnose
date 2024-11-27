import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Add cache control headers to prevent unnecessary reloads
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without authentication
        if (req.nextUrl.pathname === '/joyspanel/login') {
          return true;
        }
        // Require authentication for all other /joyspanel routes
        return !!token;
      },
    },
    pages: {
      signIn: '/joyspanel/login',
    },
  }
);

export const config = {
  matcher: ['/joyspanel/:path*'],
}; 