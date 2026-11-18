'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import {
  Store,
  Package,
  ExternalLink,
  Edit2,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

// ── Types ──────────────────────────────────────────────────────────────────────

type StallType = 'Fixed' | 'Mobile';
type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

interface DayHours {
  closed: boolean;
  open: string;
  close: string;
}

interface Product {
  id: string;
  name: string;
  unit: string;
  price: number; // ₹
  available: boolean;
}

const DAYS: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const defaultHours: Record<DayKey, DayHours> = {
  Mon: { closed: false, open: '07:00', close: '20:00' },
  Tue: { closed: false, open: '07:00', close: '20:00' },
  Wed: { closed: false, open: '07:00', close: '20:00' },
  Thu: { closed: false, open: '07:00', close: '20:00' },
  Fri: { closed: false, open: '07:00', close: '20:00' },
  Sat: { closed: false, open: '07:00', close: '18:00' },
  Sun: { closed: true, open: '09:00', close: '14:00' },
};

// ── Toggle component ───────────────────────────────────────────────────────────

function AvailabilityToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent',
        'transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        checked ? 'bg-primary' : 'bg-divider'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function ShopPage() {
  // Shop details state
  const [shopId, setShopId] = useState('');
  const [shopSlug, setShopSlug] = useState('');
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('produce');
  const [stallType, setStallType] = useState<StallType>('Fixed');
  const [hours, setHours] = useState<Record<DayKey, DayHours>>(defaultHours);
  const [published, setPublished] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);
  const [actionError, setActionError] = useState('');
  const [loadingShop, setLoadingShop] = useState(true);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [unpublishWarning, setUnpublishWarning] = useState(false);

  // New product form
  const [newName, setNewName] = useState('');
  const [newUnit, setNewUnit] = useState('kg');
  const [newPrice, setNewPrice] = useState('');

  // Edit product form
  const [editName, setEditName] = useState('');
  const [editUnit, setEditUnit] = useState('kg');
  const [editPrice, setEditPrice] = useState('');

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(async ({ data, error: authError }) => {
      if (authError) {
        setActionError(authError.message);
        setLoadingShop(false);
        return;
      }
      const userId = data.user?.id;
      if (!userId) {
        setLoadingShop(false);
        return;
      }
      const { data: shop, error: shopError } = await supabase
        .from('shops')
        .select('id,slug,name,description,category,stall_type,status,opening_hours')
        .eq('owner_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (shopError) {
        setActionError(shopError.message);
        setLoadingShop(false);
        return;
      }
      if (!shop) {
        setLoadingShop(false);
        return;
      }
      setShopId(shop.id);
      setShopSlug(shop.slug);
      setShopName(shop.name);
      setDescription(shop.description || '');
      setCategory(shop.category);
      setStallType(shop.stall_type === 'mobile' ? 'Mobile' : 'Fixed');
      setPublished(shop.status === 'published');
      if (shop.opening_hours) setHours(shop.opening_hours as Record<DayKey, DayHours>);

      const { data: rows, error: productsError } = await supabase
        .from('products')
        .select('id,name,unit,selling_price_paise,is_available')
        .eq('shop_id', shop.id)
        .order('created_at', { ascending: true });
      if (productsError) {
        setActionError(productsError.message);
        setLoadingShop(false);
        return;
      }
      setProducts((rows || []).map((row) => ({
        id: row.id,
        name: row.name,
        unit: row.unit,
        price: row.selling_price_paise / 100,
        available: row.is_available,
      })));
      setLoadingShop(false);
    });
  }, []);

  async function handleSaveDetails() {
    setActionError('');
    if (!shopId) {
      setActionError('Create your shop through onboarding before editing its details.');
      return;
    }
    setSavingDetails(true);
    const supabase = createClient();
    const { error } = await supabase
      .from('shops')
      .update({
        name: shopName.trim(),
        description: description.trim() || null,
        category,
        stall_type: stallType.toLowerCase(),
        opening_hours: hours,
      })
      .eq('id', shopId);
    if (error) {
      setActionError(error.message);
      setSavingDetails(false);
      return;
    }
    setSavingDetails(false);
    setEditOpen(false);
  }

  function handleToggleHourClosed(day: DayKey) {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], closed: !prev[day].closed },
    }));
  }

  function handleHourChange(
    day: DayKey,
    field: 'open' | 'close',
    value: string
  ) {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  }

  async function handleAddProduct() {
    setActionError('');
    const price = Number(newPrice);
    if (!shopId) {
      setActionError('Create your shop through onboarding before adding products.');
      return;
    }
    if (!newName.trim() || !Number.isFinite(price) || price <= 0) {
      setActionError('Enter a product name and a valid price above zero.');
      return;
    }
    const supabase = createClient();
    const { data: row, error } = await supabase
      .from('products')
      .insert({
        shop_id: shopId,
        name: newName.trim(),
        unit: newUnit,
        selling_price_paise: Math.round(price * 100),
        is_available: true,
      })
      .select('id')
      .single();
    if (error) {
      setActionError(error.message);
      return;
    }
    setProducts((prev) => [
      ...prev,
      { id: row.id, name: newName.trim(), unit: newUnit, price, available: true },
    ]);
    setNewName('');
    setNewUnit('kg');
    setNewPrice('');
    setAddFormOpen(false);
  }

  function handleStartEdit(product: Product) {
    setEditingId(product.id);
    setEditName(product.name);
    setEditUnit(product.unit);
    setEditPrice(String(product.price));
  }

  async function handleSaveEdit(id: string) {
    setActionError('');
    const price = Number(editPrice);
    if (!editName.trim() || !Number.isFinite(price) || price <= 0) {
      setActionError('Enter a product name and a valid price above zero.');
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.from('products').update({
      name: editName.trim(),
      unit: editUnit,
      selling_price_paise: Math.round(price * 100),
    }).eq('id', id);
    if (error) {
      setActionError(error.message);
      return;
    }
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, name: editName.trim(), unit: editUnit, price }
          : p
      )
    );
    setEditingId(null);
  }

  async function handleDelete(id: string) {
    const { error } = await createClient().from('products').delete().eq('id', id);
    if (error) {
      setActionError(error.message);
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleteConfirmId(null);
  }

  async function handleToggleAvailability(id: string) {
    const current = products.find((product) => product.id === id);
    if (current) {
      const { error } = await createClient().from('products').update({ is_available: !current.available }).eq('id', id);
      if (error) {
        setActionError(error.message);
        return;
      }
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, available: !p.available } : p))
    );
  }

  async function handleTogglePublish() {
    if (published) {
      setUnpublishWarning(true);
    } else {
      if (!shopId) {
        setActionError('Complete shop onboarding before publishing.');
        return;
      }
      const { error } = await createClient().from('shops').update({ status: 'published' }).eq('id', shopId);
      if (error) {
        setActionError(error.message);
        return;
      }
      setPublished(true);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
          <Store className="size-6 text-primary" />
          My Shop
        </h1>
        <p className="text-text-secondary mt-1">
          Manage your shop details and products
        </p>
      </div>
      {actionError && (
        <p role="alert" className="rounded-md border border-danger/30 bg-red-50 p-3 text-sm text-danger">
          {actionError}
        </p>
      )}
      {!shopId && (
        <Card className="text-sm text-text-secondary">
          {loadingShop
            ? 'Loading your shop...'
            : 'No shop is linked to this account yet. Complete vendor onboarding to create one.'}
        </Card>
      )}

      {/* ── SHOP DETAILS ── */}
      <section>
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
          Shop Details
        </h2>
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-lg font-semibold text-text-main">{shopName}</span>
                <Badge variant={published ? 'success' : 'muted'}>
                  {published ? 'Published' : 'Unpublished'}
                </Badge>
                <Badge variant="muted">{stallType}</Badge>
              </div>
              <p className="text-sm text-text-secondary">
                {category.replaceAll('_', ' ')}
              </p>
              <p className="text-sm text-text-secondary">{description}</p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditOpen((v) => !v)}
              >
                <Edit2 className="size-4" />
                {editOpen ? 'Cancel' : 'Edit details'}
              </Button>
              <a
                href={shopSlug ? `/shops/${shopSlug}` : '/shops'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <ExternalLink className="size-3.5" />
                View public page
              </a>
            </div>
          </div>

          {/* Edit form */}
          {editOpen && (
            <div className="mt-6 border-t border-divider pt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Shop name
                </label>
                <Input
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-base text-text-main placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-main mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-base text-text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-h-[44px]"
                >
                  <option value="produce">Produce</option>
                  <option value="food_stall">Food stall</option>
                  <option value="grocery">Grocery</option>
                  <option value="clothing">Clothing</option>
                  <option value="household_goods">Household goods</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <p className="text-sm font-medium text-text-main mb-2">Stall type</p>
                <div className="flex gap-6">
                  {(['Fixed', 'Mobile'] as StallType[]).map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="stallType"
                        value={type}
                        checked={stallType === type}
                        onChange={() => setStallType(type)}
                        className="accent-primary"
                      />
                      <span className="text-sm text-text-main">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Hours table */}
              <div>
                <p className="text-sm font-medium text-text-main mb-2">Opening hours</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="text-left text-xs text-text-secondary uppercase">
                        <th className="pb-2 pr-4 font-medium">Day</th>
                        <th className="pb-2 pr-4 font-medium">Closed</th>
                        <th className="pb-2 pr-4 font-medium">Opens</th>
                        <th className="pb-2 font-medium">Closes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-divider">
                      {DAYS.map((day) => (
                        <tr key={day}>
                          <td className="py-2 pr-4 font-medium text-text-main w-12">{day}</td>
                          <td className="py-2 pr-4">
                            <input
                              type="checkbox"
                              checked={hours[day].closed}
                              onChange={() => handleToggleHourClosed(day)}
                              className="accent-primary size-4"
                            />
                          </td>
                          <td className="py-2 pr-4">
                            <input
                              type="time"
                              value={hours[day].open}
                              disabled={hours[day].closed}
                              onChange={(e) =>
                                handleHourChange(day, 'open', e.target.value)
                              }
                              className="rounded border border-divider px-2 py-1 text-sm disabled:opacity-40 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </td>
                          <td className="py-2">
                            <input
                              type="time"
                              value={hours[day].close}
                              disabled={hours[day].closed}
                              onChange={(e) =>
                                handleHourChange(day, 'close', e.target.value)
                              }
                              className="rounded border border-divider px-2 py-1 text-sm disabled:opacity-40 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <Button onClick={handleSaveDetails} isLoading={savingDetails}>
                Save details
              </Button>
            </div>
          )}
        </Card>
      </section>

      {/* ── PRODUCTS ── */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wide flex items-center gap-1.5">
            <Package className="size-4" />
            Products
          </h2>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddFormOpen((v) => !v)}
          >
            {addFormOpen ? 'Cancel' : '+ Add product'}
          </Button>
        </div>

        {/* Add product inline form */}
        {addFormOpen && (
          <Card className="mb-4">
            <p className="text-sm font-semibold text-text-main mb-3">New product</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Product name"
                placeholder="e.g. Carrot"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-text-main">Unit</label>
                <select
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className="rounded-md border border-divider bg-surface px-3 py-2 text-base text-text-main focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                >
                  <option value="kg">kg</option>
                  <option value="piece">piece</option>
                  <option value="bunch">bunch</option>
                  <option value="gram">gram</option>
                  <option value="litre">litre</option>
                </select>
              </div>
              <Input
                label="Price (₹)"
                type="number"
                min="0"
                step="0.5"
                placeholder="0"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                size="sm"
                onClick={handleAddProduct}
                disabled={!newName.trim() || !newPrice}
              >
                Add product
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAddFormOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Product list */}
        <div className="space-y-3">
          {products.map((product) => (
            <Card key={product.id} className="p-3">
              {/* Product row */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-text-main">{product.name}</span>
                    <span className="text-sm text-text-secondary">
                      ₹{product.price}/{product.unit}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <AvailabilityToggle
                      checked={product.available}
                      onChange={() => handleToggleAvailability(product.id)}
                    />
                    <span className="text-xs text-text-secondary">
                      {product.available ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleStartEdit(product)}
                    className="p-1.5 rounded-md text-text-secondary hover:text-primary hover:bg-muted transition-colors"
                    aria-label="Edit product"
                  >
                    <Edit2 className="size-4" />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteConfirmId(
                        deleteConfirmId === product.id ? null : product.id
                      )
                    }
                    className="p-1.5 rounded-md text-text-secondary hover:text-danger hover:bg-red-50 transition-colors"
                    aria-label="Delete product"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              {/* Delete confirmation */}
              {deleteConfirmId === product.id && (
                <div className="mt-3 flex items-center gap-3 border-t border-divider pt-3 flex-wrap">
                  <AlertTriangle className="size-4 text-danger shrink-0" />
                  <p className="text-sm text-danger flex-1">
                    Are you sure? This cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Edit form */}
              {editingId === product.id && (
                <div className="mt-3 border-t border-divider pt-3 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      label="Name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-text-main">Unit</label>
                      <select
                        value={editUnit}
                        onChange={(e) => setEditUnit(e.target.value)}
                        className="rounded-md border border-divider bg-surface px-3 py-2 text-base text-text-main focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
                      >
                        <option value="kg">kg</option>
                        <option value="piece">piece</option>
                        <option value="bunch">bunch</option>
                        <option value="gram">gram</option>
                        <option value="litre">litre</option>
                      </select>
                    </div>
                    <Input
                      label="Price (₹)"
                      type="number"
                      min="0"
                      step="0.5"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleSaveEdit(product.id)}>
                      Save
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* ── SHOP PUBLICATION ── */}
      <section>
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
          Shop Publication
        </h2>
        <Card>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium text-text-main">
                Status:{' '}
                <span className={published ? 'text-primary' : 'text-text-secondary'}>
                  {published ? 'Published' : 'Unpublished'}
                </span>
              </p>
              {published && (
                <p className="text-sm text-text-secondary mt-1">
                  Your shop is visible to visitors.
                </p>
              )}
            </div>
            <Button
              variant={published ? 'danger' : 'primary'}
              size="sm"
              onClick={handleTogglePublish}
            >
              {published ? 'Unpublish' : 'Publish shop'}
            </Button>
          </div>

          {unpublishWarning && (
            <div className="mt-4 rounded-md bg-accent-surface border border-amber-300 p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="size-4 text-accent-text mt-0.5 shrink-0" />
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-accent-text font-medium">
                    Unpublish your shop?
                  </p>
                  <p className="text-sm text-accent-text">
                    Unpublishing hides your shop from visitors. All surplus listings
                    will also be hidden.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={async () => {
                        setActionError('');
                        if (!shopId) return;
                        const { error } = await createClient()
                          .from('shops')
                          .update({ status: 'paused' })
                          .eq('id', shopId);
                        if (error) {
                          setActionError(error.message);
                          return;
                        }
                        setPublished(false);
                        setUnpublishWarning(false);
                      }}
                    >
                      Unpublish
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUnpublishWarning(false)}
                    >
                      Keep published
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}
