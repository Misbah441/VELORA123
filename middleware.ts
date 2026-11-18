import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database } from './src/lib/supabase/types';

const publicVendorRoutes = new Set([
  '/vendor/sign-in',
  '/vendor/register',
  '/vendor/reset-password',
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    return new NextResponse('Authentication is not configured.', { status: 503 });
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return new NextResponse('Unable to verify your session. Please try again.', { status: 503 });
  }

  if (publicVendorRoutes.has(pathname)) {
    if (!user) return response;
    if (pathname === '/vendor/reset-password') return response;
    const destination = request.nextUrl.clone();
    const next = destination.searchParams.get('next');
    destination.pathname = next?.startsWith('/vendor') ? next : '/vendor';
    destination.search = '';
    return NextResponse.redirect(destination);
  }

  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = '/vendor/sign-in';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/vendor/:path*'],
};
