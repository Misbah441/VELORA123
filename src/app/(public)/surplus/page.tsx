'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Clock, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

type SurplusCategory = 'All' | 'Produce' | 'Food' | 'Grocery' | 'Other';

interface SurplusListing {
  id: string;
  shopSlug: string;
  shopName: string;
  area: string;
  district: string;
  productName: string;
  emoji: string;
  category: Exclude<SurplusCategory, 'All'>;
  pricePaise: number;
  originalPricePaise: number;
  quantityLeft: number;
  unit: string;
  deadlineMs: number; // epoch ms
  bgColor: string;
}

const NOW = Date.now();
const H = 3600000;
const M = 60000;

const LISTINGS: SurplusListing[] = [
  {
    id: 's1',
    shopSlug: 'amma-produce-kaloor',
    shopName: 'Amma&apos;s Fresh Produce',
    area: 'Kaloor',
    district: 'Ernakulam',
    productName: 'Raw Mango',
    emoji: '🥭',
    category: 'Produce',
    pricePaise: 4000,
    originalPricePaise: 8000,
    quantityLeft: 3,
    unit: 'kg',
    deadlineMs: NOW + 2 * H + 15 * M,
    bgColor: 'bg-amber-50',
  },
  {
    id: 's2',
    shopSlug: 'fort-kochi-street-food',
    shopName: 'Fort Kochi Street Bites',
    area: 'Fort Kochi',
    district: 'Ernakulam',
    productName: 'Fish Fry',
    emoji: '🐟',
    category: 'Food',
    pricePaise: 2500,
    originalPricePaise: 4000,
    quantityLeft: 5,
    unit: 'plate',
    deadlineMs: NOW + 45 * M,
    bgColor: 'bg-blue-50',
  },
  {
    id: 's3',
    shopSlug: 'kozhikode-spice-market',
    shopName: 'Kozhikode Spice Corner',
    area: 'Mittai Theruvu',
    district: 'Kozhikode',
    productName: 'Black Pepper',
    emoji: '⚫',
    category: 'Produce',
    pricePaise: 75000,
    originalPricePaise: 110000,
    quantityLeft: 2,
    unit: 'kg',
    deadlineMs: NOW + 1 * H + 30 * M,
    bgColor: 'bg-gray-100',
  },
  {
    id: 's4',
    shopSlug: 'alappuzha-seafood',
    shopName: 'Alappuzha Daily Catch',
    area: 'Mullackal',
    district: 'Alappuzha',
    productName: 'Tiger Prawns',
    emoji: '🦐',
    category: 'Produce',
    pricePaise: 60000,
    originalPricePaise: 95000,
    quantityLeft: 1,
    unit: 'kg',
    deadlineMs: NOW + 30 * M,
    bgColor: 'bg-orange-50',
  },
  {
    id: 's5',
    shopSlug: 'manjeri-biriyani-stall',
    shopName: 'Manjeri Biriyani Centre',
    area: 'Manjeri Town',
    district: 'Malappuram',
    productName: 'Mutton Biriyani',
    emoji: '🍖',
    category: 'Food',
    pricePaise: 15000,
    originalPricePaise: 25000,
    quantityLeft: 4,
    unit: 'plate',
    deadlineMs: NOW + 3 * H,
    bgColor: 'bg-amber-50',
  },
  {
    id: 's6',
    shopSlug: 'palluruthy-grocery',
    shopName: 'Palluruthy General Store',
    area: 'Palluruthy',
    district: 'Ernakulam',
    productName: 'Coconut Oil (1L)',
    emoji: '🫙',
    category: 'Grocery',
    pricePaise: 14000,
    originalPricePaise: 22000,
    quantityLeft: 8,
    unit: 'litre',
    deadlineMs: NOW - 15 * M, // already expired
    bgColor: 'bg-yellow-50',
  },
  {
    id: 's7',
    shopSlug: 'amma-produce-kaloor',
    shopName: 'Amma&apos;s Fresh Produce',
    area: 'Kaloor',
    district: 'Ernakulam',
    productName: 'Spinach Bunch',
    emoji: '🥬',
    category: 'Produce',
    pricePaise: 800,
    originalPricePaise: 1500,
    quantityLeft: 10,
    unit: 'bunch',
    deadlineMs: NOW + 4 * H,
    bgColor: 'bg-green-50',
  },
];

const CATEGORIES: SurplusCategory[] = ['All', 'Produce', 'Food', 'Grocery', 'Other'];

function formatCountdown(deadlineMs: number, nowMs: number): { label: string; expired: boolean } {
  const diff = deadlineMs - nowMs;
  if (diff <= 0) return { label: 'Expired', expired: true };
  const totalMins = Math.floor(diff / 60000);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hours > 0) return { label: `Closes in ${hours}h ${mins}m`, expired: false };
  return { label: `Closes in ${mins}m`, expired: false };
}

export default function SurplusPage() {
  const [category, setCategory] = useState<SurplusCategory>('All');
  const [nowMs, setNowMs] = useState<number>(NOW);

  useEffect(() => {
    const id = setInterval(() => setNowMs(Date.now()), 60000);
    return () => clearInterval(id);
  }, []);

  const filtered = LISTINGS.filter(
    (l) => category === 'All' || l.category === category
  );

  return (
    <main className="min-h-screen bg-background pb-12">
      {/* Header */}
      <section className="bg-primary text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Today&apos;s Surplus Deals</h1>
          <p className="text-green-200 text-sm">
            Discounted produce and food — collect before the deadline to reduce waste and save money
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium border transition-colors min-h-[36px]',
                category === cat
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface text-text-secondary border-divider hover:bg-muted'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-sm text-text-secondary">
          {filtered.length} listing{filtered.length !== 1 ? 's' : ''}
        </p>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="size-12" />}
            title="No surplus listings"
            description="Check back later — vendors post surplus items daily."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((listing) => {
              const { label, expired } = formatCountdown(listing.deadlineMs, nowMs);
              const discount = Math.round(
                ((listing.originalPricePaise - listing.pricePaise) / listing.originalPricePaise) * 100
              );

              return (
                <Card
                  key={listing.id}
                  className={cn('relative overflow-hidden', expired && 'opacity-60')}
                  padded={false}
                >
                  {/* Photo placeholder */}
                  <div
                    className={cn(
                      'flex items-center justify-center h-36 text-6xl relative',
                      listing.bgColor
                    )}
                  >
                    {listing.emoji}
                    {expired && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Badge variant="danger" className="text-sm px-3 py-1">
                          Expired
                        </Badge>
                      </div>
                    )}
                    {!expired && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="success">-{discount}%</Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-text-main">{listing.productName}</h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary tabular-nums">
                        ₹{(listing.pricePaise / 100).toFixed(2)}
                      </span>
                      <span className="text-sm text-text-secondary line-through tabular-nums">
                        ₹{(listing.originalPricePaise / 100).toFixed(2)}
                      </span>
                      <span className="text-xs text-text-secondary">/{listing.unit}</span>
                    </div>

                    {/* Quantity */}
                    <p className="text-sm text-text-secondary">
                      {listing.quantityLeft} {listing.unit} left
                    </p>

                    {/* Countdown */}
                    <div
                      className={cn(
                        'flex items-center gap-1 text-sm font-medium',
                        expired ? 'text-danger' : 'text-accent-text'
                      )}
                    >
                      <Clock className="size-4" />
                      {label}
                    </div>

                    {/* Shop info */}
                    <div className="flex items-center gap-1 text-xs text-text-secondary">
                      <MapPin className="size-3" />
                      {listing.shopName} · {listing.area}, {listing.district}
                    </div>

                    {/* CTA */}
                    {!expired && (
                      <Link href={`/shops/${listing.shopSlug}`} className="block pt-1">
                        <Button size="sm" fullWidth>
                          Reserve at shop
                        </Button>
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
