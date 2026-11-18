'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { createClient } from '@/lib/supabase/client';

interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  selling_price_paise: number;
  unit: string;
  is_available: boolean;
  shops: { name: string; slug: string; service_area: string | null } | null;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<ProductRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    void supabase
      .from('products')
      .select('id,name,description,selling_price_paise,unit,is_available,shops(name,slug,service_area,status)')
      .eq('id', params.id)
      .eq('is_available', true)
      .maybeSingle()
      .then(({ data }) => {
        const row = data as unknown as (ProductRow & { shops: ProductRow['shops'] & { status?: string } }) | null;
        setProduct(row?.shops && 'status' in row.shops && row.shops.status !== 'published' ? null : row);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <main className="p-8 text-sm text-text-secondary">Loading product...</main>;
  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <ErrorState
          title="Product not found"
          description="This product may be unavailable or the shop may be unpublished."
          action={<Link href="/shops" className="text-primary underline">Browse shops</Link>}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-12">
      <div className="max-w-3xl mx-auto px-4 pt-4">
        {product.shops && (
          <Link href={`/shops/${product.shops.slug}`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary">
            <ChevronLeft className="size-4" /> Back to {product.shops.name}
          </Link>
        )}
      </div>
      <section className="max-w-3xl mx-auto px-4 mt-4">
        <Card className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              {product.description && <p className="mt-2 text-text-secondary">{product.description}</p>}
            </div>
            <Badge variant={product.is_available ? 'success' : 'muted'}>
              {product.is_available ? 'Available' : 'Unavailable'}
            </Badge>
          </div>
          <p className="text-3xl font-bold text-primary">
            ₹{(product.selling_price_paise / 100).toFixed(2)}
            <span className="text-sm text-text-secondary font-normal"> / {product.unit}</span>
          </p>
          {product.shops && (
            <div className="border-t border-divider pt-4">
              <p className="font-semibold">{product.shops.name}</p>
              {product.shops.service_area && (
                <p className="mt-1 flex items-center gap-1 text-sm text-text-secondary">
                  <MapPin className="size-4" /> {product.shops.service_area}
                </p>
              )}
              <Link href={`/shops/${product.shops.slug}`} className="block mt-4">
                <Button fullWidth>View shop</Button>
              </Link>
            </div>
          )}
        </Card>
      </section>
    </main>
  );
}
