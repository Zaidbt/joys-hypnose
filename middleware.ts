import createMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Create the internationalization middleware
const intlMiddleware = createMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'fr',
  localePrefix: 'always'
});

// Create a combined middleware that handles both auth and internationalization
export default function middleware(req) {
  const publicPatterns = ["/", "/contact", "/services"];
  const isPublicPage = publicPatterns.some(pattern => 
    req.nextUrl.pathname.startsWith(`/${req.nextUrl.locale}${pattern}`)
  );

  // If it's a public page, only apply i18n middleware
  if (isPublicPage) {
    return intlMiddleware(req);
  }

  // For admin pages, apply both auth and i18n
  if (req.nextUrl.pathname.startsWith(`/${req.nextUrl.locale}/joyspanel`)) {
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
  matcher: ['/((?!api|_next|.*\\..*).*)']
}; 