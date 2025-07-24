import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/', '/register'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((prefix) => path.startsWith(prefix));
  const isPublicRoute = publicRoutes.includes(path);

  const sessionCookie = req.cookies.get('session')?.value;
  let session;
  try {
    session = sessionCookie ? await decrypt(sessionCookie) : null;
  } catch (error) {
    // Invalid token, treat as no session
    session = null;
    const response = NextResponse.next();
    response.cookies.delete('session');
    return response;
  }

  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.user
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
