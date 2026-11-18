import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const shopId = String(body.shopId || '');
    const senderName = String(body.senderName || '').trim();
    const senderContact = String(body.senderContact || '').trim();
    const message = String(body.message || '').trim();

    if (!shopId || senderName.length < 1 || senderName.length > 100
      || senderContact.length < 3 || senderContact.length > 160
      || message.length < 3 || message.length > 2000) {
      return NextResponse.json({ error: 'Check the enquiry details and try again.' }, { status: 400 });
    }

    const supabase = createClient();
    const { error } = await supabase.from('enquiries').insert({
      shop_id: shopId,
      sender_name: senderName,
      sender_contact: senderContact,
      message,
    });

    if (error) {
      return NextResponse.json({ error: 'Unable to send the enquiry.' }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
