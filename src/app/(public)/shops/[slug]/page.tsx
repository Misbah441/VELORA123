'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, MapPin, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { createClient } from '@/lib/supabase/client';

interface ShopRow {
  id: string;
  name: string;
  description: string | null;
  category: string;
  stall_type: string;
  service_area: string | null;
  public_location: string | null;
  public_contact_preference: 'phone' | 'email' | 'none';
  public_contact_value: string | null;
  opening_hours: Record<string, { open: string; close: string; closed: boolean }> | null;
  products: Array<{ id: string; name: string; selling_price_paise: number; unit: string; is_available: boolean }>;
}

export default function ShopDetailPage({ params }: { params: { slug: string } }) {
  const [shop, setShop] = useState<ShopRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryContact, setEnquiryContact] = useState('');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquiryStatus, setEnquiryStatus] = useState('');

  useEffect(() => {
    const supabase = createClient();
    void supabase
      .from('shops')
      .select('id,name,description,category,stall_type,service_area,public_location,public_contact_preference,public_contact_value,opening_hours,products(id,name,selling_price_paise,unit,is_available)')
      .eq('slug', params.slug)
      .eq('status', 'published')
      .maybeSingle()
      .then(({ data }) => {
        setShop((data as unknown as ShopRow) || null);
        setLoading(false);
      });
  }, [params.slug]);

  if (loading) return <main className="p-8 text-sm text-text-secondary">Loading shop...</main>;
  if (!shop) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <ErrorState
          title="Shop not found"
          description="This shop is not published or the link is incorrect."
          action={<Link href="/shops" className="text-primary underline">Browse shops</Link>}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-12">
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <Link href="/shops" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary">
          <ChevronLeft className="size-4" /> All shops
        </Link>
      </div>

      <section className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{shop.name}</h1>
              {shop.description && <p className="mt-2 text-text-secondary">{shop.description}</p>}
              {shop.service_area && (
                <p className="mt-3 flex items-center gap-1 text-sm text-text-secondary">
                  <MapPin className="size-4" /> {shop.service_area}
                </p>
              )}
            </div>
            <Badge variant="success">Published</Badge>
          </div>
        </Card>

        {shop.products?.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-3">Products</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {shop.products.map((product) => (
                <Card key={product.id}>
                  <div className="flex justify-between gap-3">
                    <div>
                      <Link href={`/products/${product.id}`} className="font-semibold text-text-main hover:text-primary">
                        {product.name}
                      </Link>
                      <p className="text-sm text-text-secondary">Per {product.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">₹{(product.selling_price_paise / 100).toFixed(2)}</p>
                      <Badge variant={product.is_available ? 'success' : 'muted'}>
                        {product.is_available ? 'Available' : 'Unavailable'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        <Card>
          <h2 className="font-semibold mb-3">Opening hours</h2>
          {shop.opening_hours ? (
            <div className="grid sm:grid-cols-2 gap-2 text-sm">
              {Object.entries(shop.opening_hours).map(([day, hours]) => (
                <div key={day} className="flex justify-between rounded-md bg-muted px-3 py-2">
                  <span>{day}</span>
                  <span className="text-text-secondary">
                    {hours.closed ? 'Closed' : `${hours.open || '—'}–${hours.close || '—'}`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-secondary">Opening hours not published.</p>
          )}
        </Card>

        {shop.public_contact_preference !== 'none' && shop.public_contact_value && (
          <Card>
            <p className="text-sm font-semibold mb-2">Public contact</p>
            <a href={shop.public_contact_preference === 'phone' ? `tel:${shop.public_contact_value}` : `mailto:${shop.public_contact_value}`} className="flex items-center gap-2 text-primary">
              <Phone className="size-4" /> {shop.public_contact_value}
            </a>
          </Card>
        )}

        <Card>
          <h2 className="font-semibold mb-3">Send an enquiry</h2>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setEnquiryStatus('');
              const response = await fetch('/api/enquiries', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                  shopId: shop.id,
                  senderName: enquiryName,
                  senderContact: enquiryContact,
                  message: enquiryMessage,
                }),
              });
              if (response.ok) {
                setEnquiryStatus('Enquiry sent.');
                setEnquiryName('');
                setEnquiryContact('');
                setEnquiryMessage('');
              } else {
                setEnquiryStatus('Unable to send enquiry.');
              }
            }}
            className="space-y-3"
          >
            <input required maxLength={100} value={enquiryName} onChange={(event) => setEnquiryName(event.target.value)} placeholder="Your name" className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]" />
            <input required maxLength={160} value={enquiryContact} onChange={(event) => setEnquiryContact(event.target.value)} placeholder="Phone or email" className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]" />
            <textarea required maxLength={2000} value={enquiryMessage} onChange={(event) => setEnquiryMessage(event.target.value)} placeholder="Write your enquiry" rows={4} className="w-full rounded-md border border-divider px-3 py-2" />
            <Button type="submit">Send enquiry</Button>
            {enquiryStatus && <p className="text-sm text-text-secondary" role="status">{enquiryStatus}</p>}
          </form>
        </Card>
      </section>
    </main>
  );
}
