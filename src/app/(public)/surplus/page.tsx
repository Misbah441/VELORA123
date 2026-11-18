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
  const [loadError, setLoadError] = useState('');
  const [selectedListing, setSelectedListing] = useState<ListingRow | null>(null);
  const [contact, setContact] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [reserving, setReserving] = useState(false);
  const [reservationError, setReservationError] = useState('');
  const [reservationToken, setReservationToken] = useState('');

  useEffect(() => {
    const supabase = createClient();
    void supabase
      .from('surplus_listings')
      .select('id,eligible_quantity,reserved_quantity,discounted_price_paise,normal_price_paise,collection_deadline,pickup_instructions,products(name,unit,image_url),shops(name,slug,service_area)')
      .eq('status', 'active')
      .gt('collection_deadline', new Date().toISOString())
      .order('collection_deadline', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setLoadError('Unable to load current surplus listings. Please try again later.');
          setLoading(false);
          return;
        }
        setListings((data || []) as unknown as ListingRow[]);
        setLoading(false);
      });
  }, []);

  async function submitReservation(event: React.FormEvent) {
    event.preventDefault();
    if (!selectedListing) return;
    setReservationError('');
    setReserving(true);

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          listingId: selectedListing.id,
          quantity: Number(quantity),
          contact: contact.trim(),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        setReservationError(result.error || 'Unable to reserve this listing.');
        return;
      }
      const token = result.reservation?.token;
      if (typeof token !== 'string') {
        setReservationError('Reservation was created but no tracking reference was returned.');
        return;
      }
      setReservationToken(token);
      setListings((current) =>
        current.map((listing) =>
          listing.id === selectedListing.id
            ? { ...listing, reserved_quantity: listing.reserved_quantity + Number(quantity) }
            : listing
        )
      );
    } catch {
      setReservationError('Unable to reach the server. Check your connection and try again.');
    } finally {
      setReserving(false);
    }
  }

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
        ) : loadError ? (
          <p role="alert" className="text-sm text-danger">{loadError}</p>
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
                    {listing.shops && remaining > 0 && (
                      <Button
                        fullWidth
                        className="mt-2"
                        onClick={() => {
                          setSelectedListing(listing);
                          setQuantity('1');
                          setContact('');
                          setReservationError('');
                          setReservationToken('');
                        }}
                      >
                        Reserve for pickup
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {selectedListing && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !reserving) setSelectedListing(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="reservation-title"
            className="w-full max-w-md rounded-lg bg-surface p-6 shadow-xl"
          >
            {reservationToken ? (
              <div className="space-y-4">
                <h2 id="reservation-title" className="text-xl font-bold">Request submitted</h2>
                <p className="text-sm text-text-secondary">
                  Your request is pending vendor confirmation. Save this private link to check its status.
                </p>
                <Link href={`/reservation/${reservationToken}`} className="block">
                  <Button fullWidth>View reservation status</Button>
                </Link>
                <Button variant="ghost" fullWidth onClick={() => setSelectedListing(null)}>Close</Button>
              </div>
            ) : (
              <>
                <h2 id="reservation-title" className="text-xl font-bold">Reserve {selectedListing.products?.name}</h2>
                <p className="mt-1 text-sm text-text-secondary">
                  Request only; the vendor must confirm before it is reserved for collection.
                </p>
                <form onSubmit={submitReservation} className="mt-5 space-y-4">
                  <div>
                    <label htmlFor="reservation-quantity" className="mb-1 block text-sm font-medium">Quantity</label>
                    <input
                      id="reservation-quantity"
                      type="number"
                      min="1"
                      max={Math.min(100, selectedListing.eligible_quantity - selectedListing.reserved_quantity)}
                      required
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                      className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="reservation-contact" className="mb-1 block text-sm font-medium">Phone or email</label>
                    <input
                      id="reservation-contact"
                      required
                      maxLength={160}
                      value={contact}
                      onChange={(event) => setContact(event.target.value)}
                      placeholder="How can the vendor contact you?"
                      className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]"
                    />
                    <p className="mt-1 text-xs text-text-secondary">Only the vendor can see this contact detail.</p>
                  </div>
                  {reservationError && <p role="alert" className="text-sm text-danger">{reservationError}</p>}
                  <div className="flex gap-2">
                    <Button type="submit" fullWidth isLoading={reserving}>Send request</Button>
                    <Button type="button" variant="ghost" onClick={() => setSelectedListing(null)} disabled={reserving}>Cancel</Button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
