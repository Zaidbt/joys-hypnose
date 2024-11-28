import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    console.log('Middleware running for path:', req.nextUrl.pathname);
    console.log('Auth token present:', !!req.nextauth.token);

    // Add cache control headers to prevent unnecessary reloads
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isLoginPage = req.nextUrl.pathname === '/joyspanel/login';
        console.log('Checking authorization for:', req.nextUrl.pathname);
        console.log('Is login page:', isLoginPage);
        console.log('Token present:', !!token);

        // Allow access to login page without authentication
        if (isLoginPage) {
          // If user is already authenticated, redirect to /joyspanel
          if (token) {
            return false; // This will redirect to /joyspanel
          }
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