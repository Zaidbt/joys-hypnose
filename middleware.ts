import createMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import { locales, defaultLocale } from './src/i18n/settings';

// Create the internationalization middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

// Create a combined middleware that handles both auth and internationalization
export default function middleware(req) {
  const publicPatterns = ["/", "/contact", "/services", "/blog"];
  const isPublicPage = publicPatterns.some(pattern => 
    req.nextUrl.pathname === pattern || 
    req.nextUrl.pathname.startsWith(`/${pattern}`)
  );

  // If it's a public page, only apply i18n middleware
  if (isPublicPage) {
    return intlMiddleware(req);
  }

  // For admin pages, apply both auth and i18n
  if (req.nextUrl.pathname.startsWith('/joyspanel')) {
    return withAuth(req, {
      pages: {
        signIn: '/joyspanel/login',
      },
    });
  }

  // For all other routes, apply i18n middleware
  return intlMiddleware(req);
}

// Configure middleware matcher
export const config = {
  matcher: [
    // Match all pathnames except for
    // - /api routes
    // - /_next (Next.js internals)
    // - /static (inside /public)
    // - .*\\..*$ (files)
    '/((?!api|_next|static|.*\\..*|favicon.ico).*)',
    // Match all pathnames within /joyspanel
    '/joyspanel/:path*'
  ]
}; 