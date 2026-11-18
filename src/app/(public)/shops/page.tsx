'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

type DemoCategory = 'All' | 'produce' | 'food_stall' | 'grocery' | 'clothing' | 'household_goods';

interface ShopRow {
  id: string;
  slug: string;
  name: string;
  category: Exclude<DemoCategory, 'All'>;
  service_area: string | null;
  description: string | null;
  updated_at: string;
  status: 'published';
}

const categories: Array<{ value: DemoCategory; label: string }> = [
  { value: 'All', label: 'All' },
  { value: 'produce', label: 'Produce' },
  { value: 'food_stall', label: 'Food stalls' },
  { value: 'grocery', label: 'Grocery' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'household_goods', label: 'Household' },
];

export default function ShopsPage() {
  const [shops, setShops] = useState<ShopRow[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<DemoCategory>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearch(params.get('q') || '');
    const categoryParam = params.get('category');
    if (categoryParam && ['produce', 'food_stall', 'grocery', 'clothing', 'household_goods'].includes(categoryParam)) {
      setCategory(categoryParam as DemoCategory);
    }

    const supabase = createClient();
    void supabase
      .from('shops')
      .select('id,slug,name,category,service_area,description,updated_at,status')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })
      .then(({ data }) => {
        setShops((data || []) as unknown as ShopRow[]);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return shops.filter((shop) => {
      if (category !== 'All' && shop.category !== category) return false;
      if (!query) return true;
      return [shop.name, shop.service_area, shop.description]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [category, search, shops]);

  return (
    <main className="min-h-screen bg-background pb-12">
      <section className="bg-primary text-white py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-1">Shop Directory</h1>
          <p className="text-green-200 text-sm">Discover published local vendors across Kerala.</p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-secondary" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search shops or areas..."
            className="w-full pl-9 pr-3 rounded-md border border-divider bg-surface text-text-main placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setCategory(item.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium border min-h-[44px]',
                category === item.value
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface text-text-secondary border-divider'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-sm text-text-secondary">Loading shops...</p>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No shops found"
            description="Try another area or category. Newly published shops will appear here."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((shop) => (
              <Link key={shop.id} href={`/shops/${shop.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <div className="h-28 rounded-md bg-muted flex items-center justify-center mb-4">
                    <MapPin className="size-8 text-primary" />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-text-main">{shop.name}</h2>
                    <Badge variant="success">Published</Badge>
                  </div>
                  {shop.service_area && (
                    <p className="mt-2 text-sm text-text-secondary flex items-center gap-1">
                      <MapPin className="size-3" /> {shop.service_area}
                    </p>
                  )}
                  {shop.description && (
                    <p className="mt-2 text-sm text-text-secondary line-clamp-3">{shop.description}</p>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
