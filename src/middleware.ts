import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: '/login',
  },
});

export function middleware(request: NextRequest) {
  // Handle uploads path
  if (request.nextUrl.pathname.startsWith('/uploads/')) {
    console.log('Handling upload request:', request.nextUrl.pathname);
    // Rewrite to the API route
    return NextResponse.rewrite(new URL('/api/serve-upload' + request.nextUrl.pathname.replace('/uploads', ''), request.url));
  }

  // Return undefined to allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/joyspanel/:path*',
    '/uploads/:path*',
  ],
};