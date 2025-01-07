import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Separate middleware for uploads
export async function middleware(request: NextRequest) {
  console.log('Middleware called for path:', request.nextUrl.pathname);
  
  // Handle uploads path
  if (request.nextUrl.pathname.startsWith('/uploads/')) {
    const filename = request.nextUrl.pathname.replace('/uploads/', '');
    console.log('Handling upload request for file:', filename);
    
    // Create the rewrite URL
    const rewriteUrl = new URL(`/api/serve-upload/${filename}`, request.url);
    console.log('Rewriting to:', rewriteUrl.toString());
    
    return NextResponse.rewrite(rewriteUrl);
  }

  // For /joyspanel routes, use withAuth
  if (request.nextUrl.pathname.startsWith('/joyspanel/')) {
    const authMiddleware = withAuth({
      callbacks: {
        authorized: ({ token }) => !!token,
      },
      pages: {
        signIn: '/login',
      },
    });
    
    // @ts-ignore - withAuth types are not perfect
    return authMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/joyspanel/:path*',
    '/uploads/:path*',
  ],
};