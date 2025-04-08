import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Daftar halaman publik yang bisa diakses tanpa token
const publicPaths = [
  '/',
  '/home',
  '/destinations',
  '/itineraries/draft',
  '/login',
  '/register',
  '/favicon.ico',
  /^\/images\/.*$/,
  /^\/api\/auth\/.*$/,
  /^\/api\/public\/.*$/,
  /^\/_next\/.*$/,
  /^\/static\/.*$/,
]

export function middleware(request: NextRequest) {
  console.log('Middleware running...') // Pastikan middleware dijalankan

  const { pathname } = request.nextUrl

  const isPublic = publicPaths.some(path => {
    if (typeof path === 'string') return pathname === path
    if (path instanceof RegExp) return path.test(pathname)
    return false
  })

  console.log('Is Public Path:', isPublic)

  // Jika halaman publik, lanjutkan tanpa gangguan
  if (isPublic) {
    return NextResponse.next()
  }

  // Jika halaman privat, pastikan pengguna tidak dapat mengakses tanpa token
  // Middleware ini tidak mengatur redirect untuk login, karena sudah ditangani di Navbar.tsx
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api/public|_next/static|_next/image|favicon.ico|static).*)' // Mengintersep semua halaman kecuali yang ada dalam pengecualian
  ]
}
