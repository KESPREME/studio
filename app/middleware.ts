import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect old login route to new auth route
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/(auth)/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
