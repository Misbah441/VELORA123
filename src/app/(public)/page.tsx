'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, ChevronRight, Tag } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

interface ShopRow {
  id: string;
  slug: string;
  name: string;
  category: string;
  service_area: string | null;
  updated_at: string;
}

const categories = [
  { label: 'Produce', value: 'produce', emoji: '🥦' },
  { label: 'Food Stalls', value: 'food_stall', emoji: '🍱' },
  { label: 'Grocery', value: 'grocery', emoji: '🛒' },
  { label: 'Clothing', value: 'clothing', emoji: '👗' },
  { label: 'Household', value: 'household_goods', emoji: '🏠' },
];

export default function HomePage() {
  const [shops, setShops] = useState<ShopRow[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const supabase = createClient();
    void supabase
      .from('shops')
      .select('id,slug,name,category,service_area,updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .limit(6)
      .then(({ data }) => setShops((data || []) as unknown as ShopRow[]));
  }, []);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const query = encodeURIComponent(search.trim());
    window.location.href = query ? `/shops?q=${query}` : '/shops';
  }

  return (
    <div className="bg-background">
      <section className="bg-primary text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Discover shops near you</h1>
          <p className="text-green-100 text-lg">Fresh produce, local food stalls, and neighbourhood businesses.</p>
          <form onSubmit={submitSearch} className="bg-surface rounded-lg p-3 flex flex-col sm:flex-row gap-2 shadow-lg">
            <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-md bg-muted text-text-secondary text-sm min-h-[44px]">
              <MapPin className="size-4" /> Select area
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-secondary" />
              <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search shops, products…" className="w-full pl-9 pr-4 py-2 rounded-md border border-divider text-text-main min-h-[44px]" />
            </div>
            <Button type="submit" className="sm:shrink-0">Search</Button>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-semibold mb-4">Browse by category</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Link key={category.value} href={`/shops?category=${category.value}`} className="flex flex-col items-center gap-2 px-4 py-3 bg-surface rounded-lg border border-divider shrink-0 min-h-[44px]">
              <span className="text-2xl">{category.emoji}</span>
              <span className="text-xs font-medium whitespace-nowrap">{category.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Nearby shops</h2>
          <Link href="/shops" className="flex items-center gap-1 text-sm text-primary">See all <ChevronRight className="size-4" /></Link>
        </div>
        {shops.length === 0 ? (
          <Card className="text-sm text-text-secondary">Published shops will appear here.</Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shops.map((shop) => (
              <Link key={shop.id} href={`/shops/${shop.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <div className="h-36 bg-muted rounded-md mb-3 flex items-center justify-center"><MapPin className="size-10 text-primary" /></div>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{shop.name}</h3>
                      <Badge variant="success">Published</Badge>
                    </div>
                    {shop.service_area && <p className="flex items-center gap-1 text-sm text-text-secondary"><MapPin className="size-3" /> {shop.service_area}</p>}
                    <Badge variant="muted">{shop.category}</Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-accent-surface rounded-lg p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
          <div>
            <h2 className="text-xl font-semibold text-accent-text mb-1">Today&apos;s surplus deals</h2>
            <p className="text-text-secondary text-sm">Discounted fresh stock from local vendors.</p>
          </div>
          <Link href="/surplus"><Button variant="secondary"><Tag className="size-4" /> View surplus</Button></Link>
        </div>
      </section>

      <section className="bg-muted py-12 px-4">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-2xl font-bold">Are you a vendor?</h2>
          <p className="text-text-secondary">List your shop, manage stock, track earnings, and reach more customers.</p>
          <Link href="/vendor/register"><Button size="lg">Register your shop →</Button></Link>
        </div>
      </section>
    </div>
  );
}
