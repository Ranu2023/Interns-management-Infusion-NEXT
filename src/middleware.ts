
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/', '/register'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((prefix) => path.startsWith(prefix));
  const isPublicRoute = publicRoutes.includes(path);

  const session = await getSession();

  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  // Allow access to public routes even if logged in, except for the root path
  // which should redirect to the dashboard if a session exists.
  if (path === '/' && session?.user) {
     return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

    