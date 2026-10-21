import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const CONTENT_SECURITY_POLICY = `
          default-src 'self';
          script-src 'self' 'unsafe-inline' https://*.googletagmanager.com https://*.google-analytics.com https://va.vercel-scripts.com https://vercel.live https://*.google.com https://*.gstatic.com;
          style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.gstatic.com;
          font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com data:;
          img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com https://*.gstatic.com https://*.google.com https://flagcdn.com;
          connect-src 'self' https://*.google-analytics.com https://*.googletagmanager.com https://*.analytics.google.com https://*.google.com https://*.gstatic.com;
          frame-src 'self' https://vercel.live https://*.googletagmanager.com;
          object-src 'none';
          frame-ancestors 'none';
          base-uri 'self';
          form-action 'self';
          `
     .replace(/\s{2,}/g, ' ')
     .trim()

export function middleware(request: NextRequest) {
     const { nextUrl } = request
     const { pathname, search } = nextUrl

     const redirectTo = (toPath: string) => {
          const url = nextUrl.clone()
          url.pathname = toPath
          url.search = search
          return NextResponse.redirect(url, 301)
     }

     // 0) Force default locale on root: "/" -> "/en"
     //    (Place this before next-intl to keep behavior identical to your old next.config redirect)
     if (pathname === '/') {
          return redirectTo('/en')
     }

     if (pathname !== '/' && pathname.endsWith('/')) {
          return redirectTo(pathname.slice(0, -1))
     }

     if (/^\/pt[-_]?br(\/|$)/i.test(pathname) && !pathname.startsWith('/pt-br')) {
          const normalized = pathname.replace(/^\/pt[-_]?br/i, '/pt-br')
          return redirectTo(normalized)
     }

     // 3) Legacy alias: "/br" -> "/pt-br"
     if (pathname === '/br' || pathname.startsWith('/br/')) {
          const rewritten = pathname === '/br' ? '/pt-br' : pathname.replace(/^\/br/, '/pt-br')
          return redirectTo(rewritten)
     }

     // 4) Hand off to next-intl for locale routing
     const response = intlMiddleware(request)

     // 5) Security headers
     response.headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY)
     response.headers.set('X-Content-Type-Options', 'nosniff')
     response.headers.set('X-Frame-Options', 'DENY')
     response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
     response.headers.set('Permissions-Policy', 'geolocation=(), microphone=()')
     response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')

     return response
}

// Run on app routes; exclude assets/APIs
export const config = {
     matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
