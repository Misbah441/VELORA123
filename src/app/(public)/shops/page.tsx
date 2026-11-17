'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Clock, Tag, MapPin, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

type ShopType = 'All' | 'Produce' | 'Food Stall' | 'Grocery' | 'Clothing' | 'Household';

interface DemoShop {
  slug: string;
  name: string;
  type: Exclude<ShopType, 'All'>;
  area: string;
  district: string;
  isOpen: boolean;
  lastUpdated: string;
  hasSurplus: boolean;
  description: string;
  emoji: string;
}

const DEMO_SHOPS: DemoShop[] = [
  {
    slug: 'amma-produce-kaloor',
    name: "Amma's Fresh Produce",
    type: 'Produce',
    area: 'Kaloor',
    district: 'Ernakulam',
    isOpen: true,
    lastUpdated: '8 min ago',
    hasSurplus: true,
    description: 'Daily fresh vegetables and fruits sourced directly from local farmers.',
    emoji: '🥦',
  },
  {
    slug: 'fort-kochi-street-food',
    name: 'Fort Kochi Street Bites',
    type: 'Food Stall',
    area: 'Fort Kochi',
    district: 'Ernakulam',
    isOpen: true,
    lastUpdated: '2 min ago',
    hasSurplus: false,
    description: 'Authentic Kerala street snacks – pazham pori, unniyappam, and more.',
    emoji: '🍢',
  },
  {
    slug: 'palluruthy-grocery',
    name: 'Palluruthy General Store',
    type: 'Grocery',
    area: 'Palluruthy',
    district: 'Ernakulam',
    isOpen: false,
    lastUpdated: '45 min ago',
    hasSurplus: false,
    description: 'Everything you need for the household — staples, spices, cleaning supplies.',
    emoji: '🛒',
  },
  {
    slug: 'thrissur-silks',
    name: 'Thrissur Traditional Silks',
    type: 'Clothing',
    area: 'Swaraj Round',
    district: 'Thrissur',
    isOpen: true,
    lastUpdated: '1 hr ago',
    hasSurplus: false,
    description: 'Handloom sarees, kasavu mundus and traditional Kerala textiles.',
    emoji: '🧵',
  },
  {
    slug: 'kozhikode-spice-market',
    name: 'Kozhikode Spice Corner',
    type: 'Produce',
    area: 'Mittai Theruvu',
    district: 'Kozhikode',
    isOpen: true,
    lastUpdated: '15 min ago',
    hasSurplus: true,
    description: 'Premium whole spices: pepper, cardamom, cinnamon, and Malabar blends.',
    emoji: '🌶️',
  },
  {
    slug: 'alappuzha-seafood',
    name: 'Alappuzha Daily Catch',
    type: 'Produce',
    area: 'Mullackal',
    district: 'Alappuzha',
    isOpen: true,
    lastUpdated: '5 min ago',
    hasSurplus: true,
    description: 'Fresh fish and seafood from the backwaters – karimeen, prawns, crab.',
    emoji: '🐟',
  },
  {
    slug: 'kottayam-rubber-household',
    name: 'Kottayam Home Essentials',
    type: 'Household',
    area: 'KK Road',
    district: 'Kottayam',
    isOpen: false,
    lastUpdated: '2 hr ago',
    hasSurplus: false,
    description: 'Household goods, kitchenware, and rubber-based products from local manufacturers.',
    emoji: '🏠',
  },
  {
    slug: 'manjeri-biriyani-stall',
    name: 'Manjeri Biriyani Centre',
    type: 'Food Stall',
    area: 'Manjeri Town',
    district: 'Malappuram',
    isOpen: true,
    lastUpdated: '20 min ago',
    hasSurplus: true,
    description: 'Malabar dum biriyani, pathiri, and Kerala style chicken curries.',
    emoji: '🍛',
  },
];

const SHOP_TYPES: ShopType[] = ['All', 'Produce', 'Food Stall', 'Grocery', 'Clothing', 'Household'];

const typeVariant: Record<Exclude<ShopType, 'All'>, 'success' | 'warning' | 'info' | 'muted' | 'default'> = {
  Produce: 'success',
  'Food Stall': 'warning',
  Grocery: 'info',
  Clothing: 'muted',
  Household: 'default',
};

export default function ShopsPage() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<ShopType>('All');
  const [onlyOpen, setOnlyOpen] = useState(false);

  const filtered = useMemo(() => {
    return DEMO_SHOPS.filter((shop) => {
      const matchesType = selectedType === 'All' || shop.type === selectedType;
      const matchesOpen = !onlyOpen || shop.isOpen;
      const matchesSearch =
        !search ||
        shop.name.toLowerCase().includes(search.toLowerCase()) ||
        shop.area.toLowerCase().includes(search.toLowerCase()) ||
        shop.district.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesOpen && matchesSearch;
    });
  }, [search, selectedType, onlyOpen]);

  return (
    <main className="min-h-screen bg-background">
      {/* Page header */}
      <section className="bg-primary text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Shop Directory</h1>
          <p className="text-green-200 text-sm">
            Discover local vendors across Kerala — fresh produce, street food, grocery & more
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-secondary" />
            <input
              type="search"
              placeholder="Search shops, areas…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                'w-full pl-9 pr-3 rounded-md border border-divider bg-surface text-text-main',
                'placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary',
                'min-h-[44px] text-sm'
              )}
            />
          </div>

          {/* Open/Closed toggle */}
          <button
            onClick={() => setOnlyOpen((v) => !v)}
            className={cn(
              'inline-flex items-center gap-2 px-4 rounded-md border text-sm font-medium transition-colors min-h-[44px]',
              onlyOpen
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-text-secondary border-divider hover:bg-muted'
            )}
          >
            <Clock className="size-4" />
            Open now
          </button>
        </div>

        {/* Type filter pills */}
        <div className="flex flex-wrap gap-2">
          {SHOP_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium border transition-colors min-h-[36px]',
                selectedType === type
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface text-text-secondary border-divider hover:bg-muted'
              )}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-text-secondary">
          {filtered.length} shop{filtered.length !== 1 ? 's' : ''} found
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Layers className="size-12" />}
            title="No shops found"
            description="Try adjusting your filters or search term."
            action={
              <button
                onClick={() => { setSearch(''); setSelectedType('All'); setOnlyOpen(false); }}
                className="text-primary underline text-sm"
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((shop) => (
              <Link key={shop.slug} href={`/shops/${shop.slug}`} className="group block">
                <Card className="h-full hover:shadow-md transition-shadow">
                  {/* Emoji banner */}
                  <div className="rounded-md bg-muted flex items-center justify-center h-24 text-5xl mb-3">
                    {shop.emoji}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold text-text-main group-hover:text-primary transition-colors leading-snug">
                        {shop.name}
                      </h2>
                      <Badge variant={shop.isOpen ? 'success' : 'muted'} className="shrink-0">
                        {shop.isOpen ? 'Open' : 'Closed'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={typeVariant[shop.type]}>
                        <Tag className="size-3" />
                        {shop.type}
                      </Badge>
                      {shop.hasSurplus && (
                        <Badge variant="warning">🏷️ Surplus</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-text-secondary">
                      <MapPin className="size-3" />
                      {shop.area}, {shop.district}
                    </div>

                    <p className="text-xs text-text-secondary line-clamp-2">{shop.description}</p>

                    <p className="text-[11px] text-text-secondary">Updated {shop.lastUpdated}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
