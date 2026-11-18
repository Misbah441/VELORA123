import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const listingId = String(body.listingId || '');
    const quantity = Number(body.quantity);
    const contact = String(body.contact || '').trim();

    if (!listingId || !Number.isInteger(quantity) || quantity < 1 || quantity > 100
      || contact.length < 3 || contact.length > 160) {
      return NextResponse.json({ error: 'Check the quantity and contact details.' }, { status: 400 });
    }

    const supabase = createClient();
    const { data, error } = await supabase.rpc('create_reservation', {
      p_listing_id: listingId,
      p_quantity: quantity,
      p_customer_contact: contact,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json({ reservation: data });
  } catch {
    return NextResponse.json({ error: 'Invalid reservation request.' }, { status: 400 });
  }
}
