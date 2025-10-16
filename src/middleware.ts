import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const cookie =
    request.cookies.get('__Secure-better-auth.session_token') ??
    request.cookies.get('better-auth.session_token');

  if (!cookie?.value) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sticker/:path*',
    '/summary/:path*',
    '/delivery/:path*',
  ],
};
