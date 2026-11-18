import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const next = request.nextUrl.searchParams.get('next');
  const destination = next?.startsWith('/vendor') ? next : '/vendor';

  if (!code) {
    return NextResponse.redirect(new URL('/vendor/sign-in?error=verification', request.url));
  }

  const supabase = createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL('/vendor/sign-in?error=verification', request.url));
  }

  return NextResponse.redirect(new URL(destination, request.url));
}
