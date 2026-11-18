'use client';

import { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/ErrorState';

export default function ReservationTrackingPage({ params }: { params: { token: string } }) {
  const [reservation, setReservation] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    void fetch(`/api/reservations/${encodeURIComponent(params.token)}`)
      .then(async (response) => ({ ok: response.ok, data: await response.json() }))
      .then(({ ok, data }) => {
        setReservation(ok ? data.reservation : null);
        setError(!ok);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [params.token]);

  if (loading) return <main className="p-8 text-sm text-text-secondary">Loading reservation...</main>;
  if (error || !reservation) {
    return (
      <main className="max-w-lg mx-auto px-4 py-12">
        <ErrorState title="Reservation not found" description="The reference is invalid or expired." />
      </main>
    );
  }

  const listing = reservation.listing as { discounted_price_paise: number; pickup_instructions: string | null };
  return (
    <main className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="size-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
          <ClipboardList className="size-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Reservation status</h1>
        <p className="text-sm text-text-secondary mt-1">Private reference: {params.token.slice(0, 12)}...</p>
      </div>
      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Status</span>
          <Badge variant="warning">{String(reservation.status)}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Quantity</span>
          <span className="font-medium">{String(reservation.quantity)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Reserved price</span>
          <span className="font-medium">₹{(listing.discounted_price_paise / 100).toFixed(2)}</span>
        </div>
        {listing.pickup_instructions && (
          <p className="text-sm text-text-secondary border-t border-divider pt-4">{listing.pickup_instructions}</p>
        )}
      </Card>
    </main>
  );
}
