'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { createClient } from '@/lib/supabase/client';

interface ReservationRow {
  id: string;
  quantity: number;
  status: 'pending' | 'confirmed' | 'collected' | 'cancelled' | 'expired';
  customer_contact: string;
  created_at: string;
  listing_id: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | ReservationRow['status']>('all');

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('reservations')
      .select('id,quantity,status,customer_contact,created_at,listing_id')
      .order('created_at', { ascending: false });
    setReservations((data || []) as unknown as ReservationRow[]);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function transition(id: string, status: ReservationRow['status']) {
    const supabase = createClient();
    const { error } = await supabase.rpc('transition_reservation', {
      p_reservation_id: id,
      p_status: status,
    });
    if (!error) await load();
  }

  const filtered = filter === 'all' ? reservations : reservations.filter((row) => row.status === filter);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reservations</h1>
        <p className="text-text-secondary mt-1">Confirm collection requests and mark completions.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'confirmed', 'collected', 'cancelled', 'expired'] as const).map((value) => (
          <button key={value} type="button" onClick={() => setFilter(value)} className="px-3 py-2 rounded-full border border-divider text-sm bg-surface">
            {value === 'all' ? 'All' : value}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-text-secondary">Loading reservations...</p>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Package />} title="No reservations" description="No reservations match this filter." />
      ) : (
        <div className="space-y-3">
          {filtered.map((reservation) => (
            <Card key={reservation.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{reservation.quantity} item(s)</p>
                  <p className="text-sm text-text-secondary">{reservation.customer_contact}</p>
                  <p className="text-xs text-text-secondary mt-1">{new Date(reservation.created_at).toLocaleString('en-IN')}</p>
                </div>
                <Badge variant={reservation.status === 'pending' ? 'warning' : reservation.status === 'collected' ? 'success' : 'muted'}>
                  {reservation.status}
                </Badge>
              </div>
              {(reservation.status === 'pending' || reservation.status === 'confirmed') && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {reservation.status === 'pending' && (
                    <Button size="sm" onClick={() => void transition(reservation.id, 'confirmed')}>
                      <CheckCircle className="size-4" /> Confirm
                    </Button>
                  )}
                  {reservation.status === 'confirmed' && (
                    <Button size="sm" onClick={() => void transition(reservation.id, 'collected')}>
                      <CheckCircle className="size-4" /> Mark collected
                    </Button>
                  )}
                  <Button size="sm" variant="secondary" onClick={() => void transition(reservation.id, 'cancelled')}>
                    <XCircle className="size-4" /> Cancel
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
