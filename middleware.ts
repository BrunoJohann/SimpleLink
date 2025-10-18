import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all pathnames except for
  // - API routes
  // - _next (Next.js internals)
  // - _static (inside /public)
  // - favicon.ico
  // - opengraph-image files
  // - loja routes (store pages)
  matcher: [
    '/((?!api|_next|_static|favicon.ico|loja|.*/opengraph-image|.*\\.).*)',
  ],
}
