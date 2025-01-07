import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;

  // Handle old Wix URLs redirects
  if (url.pathname.startsWith('/home')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  if (url.pathname.startsWith('/about-us') || url.pathname.startsWith('/about-1')) {
    return NextResponse.redirect(new URL('/about', request.url));
  }

  if (url.pathname.startsWith('/services-')) {
    return NextResponse.redirect(new URL('/services', request.url));
  }

  if (url.pathname.startsWith('/contact-us')) {
    return NextResponse.redirect(new URL('/contact', request.url));
  }

  if (url.pathname.startsWith('/blog-')) {
    return NextResponse.redirect(new URL('/blog', request.url));
  }

  // Add canonical headers for SEO
  const response = NextResponse.next();
  response.headers.set(
    'Link',
    `<${process.env.NEXT_PUBLIC_BASE_URL}${url.pathname}>; rel="canonical"`
  );

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|uploads).*)',
  ],
};