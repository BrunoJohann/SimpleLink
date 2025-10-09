import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Ignorar páginas de debug, teste e APIs
  if (
    request.nextUrl.pathname.startsWith('/debug-session') ||
    request.nextUrl.pathname.startsWith('/test-dashboard') ||
    request.nextUrl.pathname.startsWith('/api/')
  ) {
    return NextResponse.next()
  }

  const isDashboard = request.nextUrl.pathname.startsWith('/dashboard')
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')

  // Para sessões de banco de dados, verificar o cookie de sessão
  const sessionToken =
    request.cookies.get('next-auth.session-token')?.value ||
    request.cookies.get('__Secure-next-auth.session-token')?.value

  const isAuth = !!sessionToken

  console.log('🔍 Middleware Debug:', {
    path: request.nextUrl.pathname,
    isAuth,
    hasSessionToken: !!sessionToken,
    cookieNames: Array.from(request.cookies.getAll().map(c => c.name)),
  })

  // Se está tentando acessar o dashboard sem estar autenticado
  if (isDashboard && !isAuth) {
    console.log('❌ Não autenticado, redirecionando para /login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Se está autenticado e tentando acessar a página de login, redirecionar para dashboard
  if (isAuthPage && isAuth) {
    console.log('✅ Já autenticado, redirecionando para /dashboard')
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  console.log('✅ Permitindo acesso')
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}
