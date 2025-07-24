import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/actions';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/', '/register'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((prefix) => path.startsWith(prefix));

  const sessionCookie = req.cookies.get('session')?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;

  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (
    publicRoutes.includes(path) &&
    session?.user
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
