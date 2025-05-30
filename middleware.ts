import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default withAuth(
  function middleware(request: NextRequest) {
    // You can access user info like this: request.nextauth.token
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Only allow if token exists
    },
  }
)

export const config = {
  matcher: [
    '/shipping',
    '/payment',
    '/place-order',
    '/profile',
    '/order/:path*',
    '/admin/:path*',
  ],
}
