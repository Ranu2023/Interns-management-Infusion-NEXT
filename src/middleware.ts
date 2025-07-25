import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key');
const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/', '/register'];

async function decryptFromMiddleware(token: string) {
  try {
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    return null;
  }
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((prefix) => path.startsWith(prefix));
  const isPublicRoute = publicRoutes.includes(path);

  const sessionToken = req.cookies.get('session')?.value;
  const session = sessionToken ? await decryptFromMiddleware(sessionToken) : null;

  if (isProtectedRoute && !session?.user) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }

  if (path === '/' && session?.user) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
