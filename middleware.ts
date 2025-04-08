// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = [
  '/',
  '/home',
  '/destinations',
  '/itineraries/draft',
  '/login',
  '/register',
  '/favicon.ico',
  /^\/images\/.*$/,
  /^\/api\/auth\/.*$/, // allow login, register API
  /^\/api\/public\/.*$/, // if you have public APIs
  /^\/_next\/.*$/, // allow Next.js internal resources
  /^\/static\/.*$/ // allow static files
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublic = publicPaths.some(path => {
    if (typeof path === 'string') return pathname === path
    if (path instanceof RegExp) return path.test(pathname)
    return false
  })

  const token = request.cookies.get('token')?.value

  // Jika halaman publik, izinkan
  if (isPublic) {
    // Tapi kalau user sudah login, redirect dari /login atau /register ke dashboard
    if (token && (pathname === '/login' || pathname === '/register')) {
      const dashboardUrl = request.nextUrl.clone()
      dashboardUrl.pathname = '/dashboard'
      return NextResponse.redirect(dashboardUrl)
    }

    return NextResponse.next()
  }

  // Jika halaman privat dan tidak ada token, redirect ke login
  if (!token) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
      Hanya intercept halaman-halaman:
      - selain static (_next, favicon, images, dll)
      - kecuali api/public (jika kamu pakai)
    */
    '/((?!api/public|_next/static|_next/image|favicon.ico|static).*)'
  ]
}
