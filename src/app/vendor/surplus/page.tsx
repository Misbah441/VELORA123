'use client';

import { useEffect, useState } from 'react';
import { Plus, Tag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { createClient } from '@/lib/supabase/client';

interface ListingRow {
  id: string;
  eligible_quantity: number;
  reserved_quantity: number;
  normal_price_paise: number;
  discounted_price_paise: number;
  collection_deadline: string;
  status: 'active' | 'expired' | 'closed';
  products: { id: string; name: string; unit: string } | null;
}

export default function VendorSurplusPage() {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [products, setProducts] = useState<Array<{ id: string; name: string; unit: string }>>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [normalPrice, setNormalPrice] = useState('');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [deadline, setDeadline] = useState('');
  const [instructions, setInstructions] = useState('');

  async function load() {
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    const { data: shops } = await supabase.from('shops').select('id').eq('owner_id', user.user.id).limit(1);
    const shopId = shops?.[0]?.id;
    if (!shopId) return;

    const [{ data: listingRows }, { data: productRows }] = await Promise.all([
      supabase
        .from('surplus_listings')
        .select('id,eligible_quantity,reserved_quantity,normal_price_paise,discounted_price_paise,collection_deadline,status,products(id,name,unit)')
        .eq('owner_id', user.user.id)
        .order('collection_deadline', { ascending: true }),
      supabase.from('products').select('id,name,unit').eq('shop_id', shopId).eq('is_available', true),
    ]);
    setListings((listingRows || []) as unknown as ListingRow[]);
    setProducts((productRows || []) as unknown as Array<{ id: string; name: string; unit: string }>);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Surplus listings</h1>
          <p className="text-text-secondary text-sm mt-1">Publish discounted stock before it expires</p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="gap-2"><Plus className="size-4" /> New listing</Button>
      </div>

      {formOpen && (
        <Card className="mb-6">
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              setError('');
              const qty = Number(quantity);
              const normal = Math.round(Number(normalPrice) * 100);
              const discounted = Math.round(Number(discountedPrice) * 100);
              if (!productId || !Number.isInteger(qty) || qty <= 0 || normal <= 0 || discounted <= 0 || !deadline) {
                setError('Complete all required fields with valid values.');
                return;
              }
              if (discounted > normal) {
                setError('Discounted price cannot exceed the normal price.');
                return;
              }
              setSaving(true);
              const supabase = createClient();
              const { data: user } = await supabase.auth.getUser();
              if (!user.user) {
                setError('Sign in again to create a listing.');
                setSaving(false);
                return;
              }
              const { data: shops } = await supabase.from('shops').select('id').eq('owner_id', user.user.id).limit(1);
              const shopId = shops?.[0]?.id;
              if (!shopId) {
                setError('Publish a shop before creating surplus listings.');
                setSaving(false);
                return;
              }
              const { error: insertError } = await supabase.from('surplus_listings').insert({
                product_id: productId,
                shop_id: shopId,
                owner_id: user.user.id,
                eligible_quantity: qty,
                reserved_quantity: 0,
                normal_price_paise: normal,
                discounted_price_paise: discounted,
                collection_deadline: new Date(deadline).toISOString(),
                pickup_instructions: instructions.trim() || null,
                status: 'active',
              });
              setSaving(false);
              if (insertError) {
                setError(insertError.message);
                return;
              }
              setFormOpen(false);
              setProductId('');
              setQuantity('');
              setNormalPrice('');
              setDiscountedPrice('');
              setDeadline('');
              setInstructions('');
              await load();
            }}
            className="grid sm:grid-cols-2 gap-4"
          >
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Product</label>
              <select value={productId} onChange={(event) => setProductId(event.target.value)} className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]">
                <option value="">Select product</option>
                {products.map((product) => <option key={product.id} value={product.id}>{product.name} / {product.unit}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Eligible quantity</label>
              <input type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Collection deadline</label>
              <input type="datetime-local" value={deadline} onChange={(event) => setDeadline(event.target.value)} className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Normal price (₹)</label>
              <input type="number" min="0.01" step="0.01" value={normalPrice} onChange={(event) => setNormalPrice(event.target.value)} className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Discounted price (₹)</label>
              <input type="number" min="0.01" step="0.01" value={discountedPrice} onChange={(event) => setDiscountedPrice(event.target.value)} className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Pickup instructions</label>
              <textarea value={instructions} maxLength={500} onChange={(event) => setInstructions(event.target.value)} rows={3} className="w-full rounded-md border border-divider px-3 py-2" />
            </div>
            {error && <p className="sm:col-span-2 text-sm text-danger" role="alert">{error}</p>}
            <div className="sm:col-span-2 flex gap-2">
              <Button type="submit" isLoading={saving}>Publish listing</Button>
              <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {listings.length === 0 ? (
        <EmptyState
          title="No surplus listings yet"
          description="Create a listing with a remaining quantity and collection deadline."
          icon={<Tag />}
          action={<Button onClick={() => setFormOpen(true)}><Plus className="size-4" /> Create listing</Button>}
        />
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{listing.products?.name || 'Surplus item'}</h2>
                  <p className="text-sm text-text-secondary">
                    {listing.eligible_quantity - listing.reserved_quantity} of {listing.eligible_quantity} remaining
                  </p>
                  <p className="flex items-center gap-1 text-xs text-accent-text mt-1">
                    <Clock className="size-3" /> {new Date(listing.collection_deadline).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{(listing.discounted_price_paise / 100).toFixed(2)}</p>
                  <Badge variant={listing.status === 'active' ? 'success' : 'muted'}>{listing.status}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
