'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, MapPin, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { createClient } from '@/lib/supabase/client';

interface ListingRow {
  id: string;
  eligible_quantity: number;
  reserved_quantity: number;
  discounted_price_paise: number;
  normal_price_paise: number;
  collection_deadline: string;
  pickup_instructions: string | null;
  products: { name: string; unit: string; image_url: string | null } | null;
  shops: { name: string; slug: string; service_area: string | null } | null;
}

export default function SurplusPage() {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    void supabase
      .from('surplus_listings')
      .select('id,eligible_quantity,reserved_quantity,discounted_price_paise,normal_price_paise,collection_deadline,pickup_instructions,products(name,unit,image_url),shops(name,slug,service_area)')
      .eq('status', 'active')
      .gt('collection_deadline', new Date().toISOString())
      .order('collection_deadline', { ascending: true })
      .then(({ data }) => {
        setListings((data || []) as unknown as ListingRow[]);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-background pb-12">
      <section className="bg-primary text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Today&apos;s Surplus Deals</h1>
          <p className="text-green-200 text-sm">Reserve discounted stock before collection closes.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-6">
        {loading ? (
          <p className="text-sm text-text-secondary">Loading listings...</p>
        ) : listings.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="size-12" />}
            title="No surplus listings"
            description="Check back later. Vendors publish available surplus listings here."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((listing) => {
              const remaining = listing.eligible_quantity - listing.reserved_quantity;
              const discount = listing.normal_price_paise
                ? Math.round((1 - listing.discounted_price_paise / listing.normal_price_paise) * 100)
                : 0;
              return (
                <Card key={listing.id} padded={false} className="overflow-hidden">
                  <div className="h-36 bg-accent-surface flex items-center justify-center">
                    {listing.products?.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={listing.products.image_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <ShoppingBag className="size-12 text-accent-text" />
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between gap-2">
                      <h2 className="font-semibold text-text-main">{listing.products?.name || 'Surplus item'}</h2>
                      {discount > 0 && <Badge variant="success">-{discount}%</Badge>}
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      ₹{(listing.discounted_price_paise / 100).toFixed(2)}
                      <span className="text-xs text-text-secondary font-normal"> / {listing.products?.unit || 'unit'}</span>
                    </p>
                    <p className="text-sm text-text-secondary">{remaining} available</p>
                    <p className="flex items-center gap-1 text-sm text-accent-text">
                      <Clock className="size-4" /> Collect by {new Date(listing.collection_deadline).toLocaleString('en-IN')}
                    </p>
                    {listing.shops?.service_area && (
                      <p className="flex items-center gap-1 text-xs text-text-secondary">
                        <MapPin className="size-3" /> {listing.shops.name} · {listing.shops.service_area}
                      </p>
                    )}
                    {listing.pickup_instructions && (
                      <p className="text-xs text-text-secondary">{listing.pickup_instructions}</p>
                    )}
                    {listing.shops && (
                      <Link href={`/shops/${listing.shops.slug}`} className="block pt-2">
                        <Button fullWidth>Reserve at shop</Button>
                      </Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
