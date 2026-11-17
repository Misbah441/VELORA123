import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, MapPin, ChevronRight, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'Explore Local Shops & Surplus Deals',
};

const CATEGORIES = [
  { label: 'Produce', emoji: '🥦' },
  { label: 'Food Stalls', emoji: '🍱' },
  { label: 'Grocery', emoji: '🛒' },
  { label: 'Clothing', emoji: '👗' },
  { label: 'Household', emoji: '🏠' },
];

const SAMPLE_SHOPS = [
  {
    id: '1',
    slug: 'rajan-vegetables',
    name: 'Rajan&apos;s Vegetables',
    category: 'Produce',
    area: 'Kaloor, Ernakulam',
    isOpen: true,
    hasSurplus: true,
    lastUpdated: '2 hours ago',
  },
  {
    id: '2',
    slug: 'mary-food-stall',
    name: 'Mary&apos;s Food Stall',
    category: 'Food Stalls',
    area: 'Palluruthy, Ernakulam',
    isOpen: true,
    hasSurplus: false,
    lastUpdated: '30 minutes ago',
  },
  {
    id: '3',
    slug: 'krishna-grocery',
    name: 'Krishna General Stores',
    category: 'Grocery',
    area: 'Fort Kochi',
    isOpen: false,
    hasSurplus: false,
    lastUpdated: '1 day ago',
  },
];

export default function HomePage() {
  return (
    <div className="bg-background">
      {/* Hero section */}
      <section className="bg-primary text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Discover shops near you
          </h1>
          <p className="text-green-100 text-lg">
            Fresh produce, local food stalls, and neighbourhood businesses —
            all in one place.
          </p>

          {/* Area + Search */}
          <div className="bg-surface rounded-lg p-3 flex flex-col sm:flex-row gap-2 shadow-lg">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-muted text-text-secondary text-sm hover:bg-primary hover:text-white transition-colors min-h-[44px] sm:w-auto"
            >
              <MapPin className="size-4 shrink-0" aria-hidden />
              <span>Select area</span>
            </button>
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-secondary"
                aria-hidden
              />
              <input
                type="search"
                placeholder="Search shops, products…"
                className="w-full pl-9 pr-4 py-2 rounded-md border border-divider text-text-main placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] text-sm"
              />
            </div>
            <Button className="sm:shrink-0">Search</Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold text-text-main mb-4">
          Browse by category
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={`/shops?category=${cat.label.toLowerCase()}`}
              className="flex flex-col items-center gap-2 px-4 py-3 bg-surface rounded-lg border border-divider hover:border-primary hover:shadow-md transition-all shrink-0 min-h-[44px]"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs font-medium text-text-main whitespace-nowrap">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Nearby shops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-main">Nearby shops</h2>
          <Link
            href="/shops"
            className="flex items-center gap-1 text-sm text-primary hover:underline"
          >
            See all <ChevronRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SAMPLE_SHOPS.map((shop) => (
            <Link key={shop.id} href={`/shops/${shop.slug}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                {/* Placeholder image */}
                <div className="w-full h-36 bg-muted rounded-md mb-3 flex items-center justify-center text-4xl">
                  🛒
                </div>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-text-main">{shop.name}</h3>
                    <Badge variant={shop.isOpen ? 'success' : 'muted'}>
                      {shop.isOpen ? 'Open' : 'Closed'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-text-secondary">
                    <MapPin className="size-3.5" aria-hidden />
                    {shop.area}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="muted">{shop.category}</Badge>
                    {shop.hasSurplus && (
                      <Badge variant="warning">
                        <Tag className="size-3" aria-hidden />
                        Surplus available
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">
                    Updated {shop.lastUpdated}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Surplus section teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-accent-surface rounded-lg p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div>
            <h2 className="text-xl font-semibold text-accent-text mb-1">
              Today&apos;s surplus deals
            </h2>
            <p className="text-text-secondary text-sm">
              Discounted fresh stock from local vendors — collect before the
              deadline.
            </p>
          </div>
          <Link href="/surplus">
            <Button variant="secondary" className="shrink-0">
              View surplus
            </Button>
          </Link>
        </div>
      </section>

      {/* Vendor CTA */}
      <section className="bg-muted py-12 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold text-text-main">
            Are you a vendor?
          </h2>
          <p className="text-text-secondary">
            List your shop, manage your stock, track your earnings, and reach
            more customers in your area.
          </p>
          <Link href="/vendor/register">
            <Button size="lg">Register your shop →</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
