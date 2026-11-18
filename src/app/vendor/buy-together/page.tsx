'use client';

import { useEffect, useState } from 'react';
import { Plus, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { createClient } from '@/lib/supabase/client';

interface GroupRow {
  id: string;
  item_name: string;
  grade: string | null;
  unit: string;
  total_quantity: number;
  area: string;
  status: 'draft' | 'open' | 'collecting_offers' | 'confirmed' | 'completed' | 'cancelled';
  organizer_id: string;
}

export default function BuyTogetherPage() {
  const [groups, setGroups] = useState<GroupRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [itemName, setItemName] = useState('');
  const [grade, setGrade] = useState('');
  const [unit, setUnit] = useState('kg');
  const [quantity, setQuantity] = useState('');
  const [area, setArea] = useState('');

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('buy_groups')
      .select('id,item_name,grade,unit,total_quantity,area,status,organizer_id')
      .order('created_at', { ascending: false });
    setGroups((data || []) as unknown as GroupRow[]);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createGroup(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    const total = Number(quantity);
    if (!itemName.trim() || !area.trim() || !Number.isInteger(total) || total <= 0) {
      setError('Enter an item, area, and valid quantity.');
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      setError('Sign in again.');
      setSaving(false);
      return;
    }
    const { error: insertError } = await supabase.from('buy_groups').insert({
      organizer_id: user.user.id,
      item_name: itemName.trim(),
      grade: grade.trim() || null,
      unit,
      total_quantity: total,
      area: area.trim(),
      status: 'open',
    });
    setSaving(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setFormOpen(false);
    setItemName('');
    setGrade('');
    setQuantity('');
    setArea('');
    await load();
  }

  async function joinGroup(groupId: string) {
    const supabase = createClient();
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;
    const group = groups.find((item) => item.id === groupId);
    if (!group) return;
    await supabase.from('buy_group_members').insert({
      group_id: groupId,
      vendor_id: user.user.id,
      requested_quantity: 1,
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">BuyTogether</h1>
          <p className="text-text-secondary mt-1">Coordinate group purchasing by area.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}><Plus className="size-4" /> New group</Button>
      </div>

      {formOpen && (
        <Card>
          <form onSubmit={createGroup} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-1">Item name</label>
              <input value={itemName} onChange={(event) => setItemName(event.target.value)} required className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Grade / quality</label>
              <input value={grade} onChange={(event) => setGrade(event.target.value)} className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <select value={unit} onChange={(event) => setUnit(event.target.value)} className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]">
                <option value="kg">kg</option><option value="piece">piece</option><option value="litre">litre</option><option value="bundle">bundle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total quantity</label>
              <input type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} required className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Area</label>
              <input value={area} onChange={(event) => setArea(event.target.value)} required className="w-full rounded-md border border-divider px-3 py-2 min-h-[44px]" />
            </div>
            {error && <p className="sm:col-span-2 text-sm text-danger" role="alert">{error}</p>}
            <div className="sm:col-span-2 flex gap-2">
              <Button type="submit" isLoading={saving}>Create group</Button>
              <Button type="button" variant="ghost" onClick={() => setFormOpen(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-text-secondary">Loading groups...</p>
      ) : groups.length === 0 ? (
        <EmptyState icon={<Users />} title="No purchase groups" description="Create a group or join one in your area." />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {groups.map((group) => (
            <Card key={group.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{group.item_name}</h2>
                  {group.grade && <p className="text-sm text-text-secondary">{group.grade}</p>}
                </div>
                <Badge variant="success">{group.status}</Badge>
              </div>
              <p className="mt-3 flex items-center gap-1 text-sm text-text-secondary"><MapPin className="size-3" /> {group.area}</p>
              <p className="mt-1 text-sm">Target: {group.total_quantity} {group.unit}</p>
              <Button size="sm" variant="secondary" className="mt-4" onClick={() => void joinGroup(group.id)}>Join with 1 {group.unit}</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
