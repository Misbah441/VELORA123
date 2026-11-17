'use client';

import { useState } from 'react';
import { Clock, CheckCircle, XCircle, Phone, Mail, ShieldOff, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

type ReservationStatus = 'Pending' | 'Confirmed' | 'Collected' | 'Expired' | 'Cancelled';
type TabFilter = 'All' | 'Pending' | 'Confirmed' | 'Collected' | 'Cancelled/Expired';

interface Reservation {
  id: string;
  item: string;
  qty: string;
  contactType: 'phone' | 'email';
  contactMasked: string;
  status: ReservationStatus;
  deadline?: string;
  timestamp?: string;
}

const demoReservations: Reservation[] = [
  {
    id: 'r1',
    item: 'Tomatoes',
    qty: '2 kg',
    contactType: 'phone',
    contactMasked: '+91 98XXX XXXXX',
    status: 'Pending',
    deadline: 'Expires in 1h 30m',
  },
  {
    id: 'r2',
    item: 'Tomatoes',
    qty: '1 kg',
    contactType: 'email',
    contactMasked: 'rav***@gmail.com',
    status: 'Confirmed',
    deadline: 'Collect by 6 PM',
  },
  {
    id: 'r3',
    item: 'Raw banana',
    qty: '3 pieces',
    contactType: 'phone',
    contactMasked: '+91 97XXX XXXXX',
    status: 'Confirmed',
    deadline: 'Collect by 5 PM',
  },
  {
    id: 'r4',
    item: 'Spinach',
    qty: '500 g',
    contactType: 'phone',
    contactMasked: '+91 94XXX XXXXX',
    status: 'Collected',
    timestamp: '2 hours ago',
  },
  {
    id: 'r5',
    item: 'Bitter gourd',
    qty: '1 kg',
    contactType: 'phone',
    contactMasked: '+91 99XXX XXXXX',
    status: 'Expired',
    timestamp: 'No-show',
  },
];

const statusConfig: Record<
  ReservationStatus,
  { badgeVariant: 'warning' | 'info' | 'success' | 'muted' | 'danger'; label: string }
> = {
  Pending: { badgeVariant: 'warning', label: 'Pending' },
  Confirmed: { badgeVariant: 'info', label: 'Confirmed' },
  Collected: { badgeVariant: 'success', label: 'Collected ✓' },
  Expired: { badgeVariant: 'muted', label: 'Expired' },
  Cancelled: { badgeVariant: 'danger', label: 'Cancelled' },
};

const tabs: TabFilter[] = ['All', 'Pending', 'Confirmed', 'Collected', 'Cancelled/Expired'];

function tabMatchesStatus(tab: TabFilter, status: ReservationStatus): boolean {
  if (tab === 'All') return true;
  if (tab === 'Cancelled/Expired') return status === 'Cancelled' || status === 'Expired';
  return status === tab;
}

export default function ReservationsPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>('All');
  const [reservations, setReservations] = useState<Reservation[]>(demoReservations);

  function updateStatus(id: string, newStatus: ReservationStatus) {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  }

  const filtered = reservations.filter((r) => tabMatchesStatus(activeTab, r.status));

  const collectedCount = reservations.filter((r) => r.status === 'Collected').length;
  const expiredCount = reservations.filter((r) => r.status === 'Expired').length;
  const cancelledCount = reservations.filter((r) => r.status === 'Cancelled').length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-main">Reservations</h1>
        <p className="text-text-secondary mt-1">
          Manage collection requests for your surplus listings
        </p>
      </div>

      {/* Privacy note */}
      <div className="flex items-center gap-2 text-xs text-text-secondary bg-muted rounded-lg px-3 py-2">
        <ShieldOff className="size-3.5 text-text-secondary" />
        Customer contact details are masked for privacy
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px]',
              activeTab === tab
                ? 'bg-primary text-white'
                : 'bg-muted text-text-secondary hover:bg-divider'
            )}
          >
            {tab}
            {tab !== 'All' && (
              <span className="ml-1.5 text-xs opacity-70">
                (
                {tab === 'Cancelled/Expired'
                  ? reservations.filter(
                      (r) => r.status === 'Cancelled' || r.status === 'Expired'
                    ).length
                  : reservations.filter((r) => r.status === (tab as ReservationStatus)).length}
                )
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reservations list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Package />}
            title="No reservations"
            description="No reservations match this filter."
          />
        ) : (
          filtered.map((res) => (
            <Card key={res.id}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-text-main">
                      {res.item} — {res.qty}
                    </span>
                    <Badge variant={statusConfig[res.status].badgeVariant}>
                      {statusConfig[res.status].label}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      {res.contactType === 'phone' ? (
                        <Phone className="size-3" />
                      ) : (
                        <Mail className="size-3" />
                      )}
                      {res.contactMasked}
                    </span>
                    {(res.deadline || res.timestamp) && (
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {res.deadline ?? res.timestamp}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-shrink-0">
                  {res.status === 'Pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(res.id, 'Confirmed')}
                      >
                        <CheckCircle className="size-4" /> Confirm
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => updateStatus(res.id, 'Cancelled')}
                      >
                        <XCircle className="size-4" /> Decline
                      </Button>
                    </>
                  )}
                  {res.status === 'Confirmed' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => updateStatus(res.id, 'Collected')}
                    >
                      <CheckCircle className="size-4" /> Mark collected
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Weekly summary */}
      <div className="bg-muted rounded-lg p-4 text-sm text-text-secondary">
        <span className="font-medium text-text-main">This week: </span>
        {collectedCount} collected · {expiredCount} expired · {cancelledCount} cancelled
      </div>
    </div>
  );
}
