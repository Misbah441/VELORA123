import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: Request,
  { params }: { params: { token: string } }
) {
  if (!/^[a-f0-9]{64}$/.test(params.token)) {
    return NextResponse.json({ error: 'Invalid reservation reference.' }, { status: 404 });
  }

  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_reservation', { p_token: params.token });
  if (error || !data) {
    return NextResponse.json({ error: 'Reservation not found.' }, { status: 404 });
  }
  return NextResponse.json({ reservation: data });
}
