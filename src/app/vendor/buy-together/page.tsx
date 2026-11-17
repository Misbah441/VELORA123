'use client';

import { useState } from 'react';
import {
  Users,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Plus,
  Info,
  ShoppingBasket,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

type BuyTogetherStatus = 'Open for joining' | 'Collecting offers' | 'Closed';

interface SupplierOffer {
  name: string;
  pricePerUnit: number;
  transport: number;
  deliveredPrice: number;
}

interface BuyTogetherGroup {
  id: string;
  item: string;
  grade: string;
  totalQty: number;
  unit: string;
  area: string;
  memberCount: number;
  status: BuyTogetherStatus;
  deadlineDays: number;
  yourShareQty?: number;
  committedQty: number;
  supplierOffers: SupplierOffer[];
  yourContribution?: {
    qty: number;
    amount: number;
    paymentStatus: string;
  };
}

const demoGroups: BuyTogetherGroup[] = [
  {
    id: 'g1',
    item: 'Tomato',
    grade: '1st grade',
    totalQty: 50,
    unit: 'kg',
    area: 'Kaloor',
    memberCount: 3,
    status: 'Open for joining',
    deadlineDays: 3,
    yourShareQty: 20,
    committedQty: 42,
    supplierOffers: [
      { name: 'Supplier A', pricePerUnit: 18, transport: 200, deliveredPrice: 22 },
      { name: 'Supplier B', pricePerUnit: 16, transport: 500, deliveredPrice: 26 },
    ],
    yourContribution: { qty: 20, amount: 440, paymentStatus: 'Pending payment' },
  },
  {
    id: 'g2',
    item: 'Coconut',
    grade: 'Medium',
    totalQty: 100,
    unit: 'pieces',
    area: 'Fort Kochi',
    memberCount: 2,
    status: 'Collecting offers',
    deadlineDays: 1,
    committedQty: 60,
    supplierOffers: [],
  },
];

const statusBadgeVariant: Record<BuyTogetherStatus, 'success' | 'warning' | 'muted'> = {
  'Open for joining': 'success',
  'Collecting offers': 'warning',
  'Closed': 'muted',
};

function GroupDetailPanel({ group }: { group: BuyTogetherGroup }) {
  return (
    <div className="mt-4 border-t border-divider pt-4 space-y-5">
      {/* Quantities */}
      <div>
        <h4 className="text-sm font-semibold text-text-main mb-2">Committed Quantities</h4>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${Math.min(100, (group.committedQty / group.totalQty) * 100)}%` }}
            />
          </div>
          <span className="text-sm text-text-secondary tabular-nums">
            {group.committedQty} / {group.totalQty} {group.unit}
          </span>
        </div>
      </div>

      {/* Supplier offers */}
      <div>
        <h4 className="text-sm font-semibold text-text-main mb-2">Supplier Offers</h4>
        {group.supplierOffers.length === 0 ? (
          <p className="text-sm text-text-secondary italic">No offers collected yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-divider">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-3 py-2 text-text-secondary font-medium">Supplier</th>
                  <th className="text-right px-3 py-2 text-text-secondary font-medium">
                    Price / {group.unit}
                  </th>
                  <th className="text-right px-3 py-2 text-text-secondary font-medium">Transport</th>
                  <th className="text-right px-3 py-2 text-text-secondary font-medium">
                    Delivered price
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {group.supplierOffers.map((offer, i) => (
                  <tr key={offer.name} className={cn('bg-surface', i === 0 && 'font-medium')}>
                    <td className="px-3 py-2 text-text-main">{offer.name}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      ₹{offer.pricePerUnit}/{group.unit}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">₹{offer.transport}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-primary font-semibold">
                      ₹{offer.deliveredPrice}/{group.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-text-secondary mt-2 italic">
          Savings compared to baseline: no comparable data available
        </p>
      </div>

      {/* Your contribution */}
      {group.yourContribution && (
        <div className="bg-muted rounded-lg p-3">
          <h4 className="text-sm font-semibold text-text-main mb-2">Your Contribution</h4>
          <dl className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <dt className="text-text-secondary text-xs">Quantity</dt>
              <dd className="font-medium text-text-main tabular-nums mt-0.5">
                {group.yourContribution.qty} {group.unit}
              </dd>
            </div>
            <div>
              <dt className="text-text-secondary text-xs">Amount</dt>
              <dd className="font-medium text-text-main tabular-nums mt-0.5">
                ₹{group.yourContribution.amount}
              </dd>
            </div>
            <div>
              <dt className="text-text-secondary text-xs">Status</dt>
              <dd className="mt-0.5">
                <Badge variant="warning">{group.yourContribution.paymentStatus}</Badge>
              </dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

function CreateGroupForm({ onCancel }: { onCancel: () => void }) {
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Group</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-text-main mb-1">Item name</label>
            <Input placeholder="e.g. Tomato, Coconut" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Grade / quality</label>
            <Input placeholder="e.g. 1st grade, medium" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Unit</label>
            <select className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-sm text-text-main min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1">
              <option value="kg">kg</option>
              <option value="pieces">pieces</option>
              <option value="litre">litre</option>
              <option value="bundle">bundle</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              Total quantity needed
            </label>
            <Input type="number" placeholder="e.g. 50" min={1} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              Min order quantity
            </label>
            <Input type="number" placeholder="e.g. 5" min={1} />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Locality / area</label>
            <Input placeholder="e.g. Kaloor, Fort Kochi" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">
              Collection deadline (days)
            </label>
            <Input type="number" placeholder="e.g. 5" min={1} max={30} required />
          </div>
          <div className="sm:col-span-2 flex gap-3 justify-end pt-2 border-t border-divider">
            <Button variant="ghost" type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              Create group
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function BuyTogetherPage() {
  const [expandedGroup, setExpandedGroup] = useState<string>('g1');
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-main">BuyTogether</h1>
          <p className="text-text-secondary mt-1">Pool purchasing power with nearby vendors</p>
        </div>
        <Button
          variant={showCreateForm ? 'secondary' : 'primary'}
          onClick={() => setShowCreateForm((v) => !v)}
        >
          {showCreateForm ? (
            <>
              <ChevronUp className="size-4" /> Hide form
            </>
          ) : (
            <>
              <Plus className="size-4" /> New group
            </>
          )}
        </Button>
      </div>

      {/* INFO box */}
      <div className="flex gap-3 rounded-lg border border-information bg-blue-50 p-4 text-sm text-information">
        <Info className="size-5 flex-shrink-0 mt-0.5" />
        <p>
          BuyTogether helps vendors combine orders to negotiate better prices. Record supplier
          quotes, compare delivered costs and track contributions manually.
        </p>
      </div>

      {/* Create group form (collapsible) */}
      {showCreateForm && <CreateGroupForm onCancel={() => setShowCreateForm(false)} />}

      {/* Active groups */}
      <section>
        <h2 className="text-lg font-semibold text-text-main mb-3">Active Groups</h2>
        <div className="space-y-4">
          {demoGroups.map((group) => {
            const isExpanded = expandedGroup === group.id;
            return (
              <Card key={group.id} padded={false} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 size-10 rounded-full bg-muted flex items-center justify-center">
                        <ShoppingBasket className="size-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-main">
                          {group.item}{' '}
                          <span className="font-normal text-text-secondary text-sm">
                            ({group.grade}, {group.totalQty} {group.unit})
                          </span>
                        </h3>
                        <div className="flex flex-wrap gap-3 mt-1 text-xs text-text-secondary">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" /> {group.area}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="size-3" /> {group.memberCount} vendors
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />{' '}
                            {group.deadlineDays === 1
                              ? 'Closes tomorrow'
                              : `${group.deadlineDays} days left`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                      <Badge variant={statusBadgeVariant[group.status]}>{group.status}</Badge>
                      {group.yourShareQty && (
                        <span className="text-xs text-text-secondary bg-muted px-2 py-0.5 rounded-full">
                          Your share: {group.yourShareQty} {group.unit}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setExpandedGroup(isExpanded ? '' : group.id)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="size-4" /> Hide details
                        </>
                      ) : (
                        <>
                          <ChevronDown className="size-4" /> View details
                        </>
                      )}
                    </Button>
                    {group.status === 'Open for joining' && !group.yourShareQty && (
                      <Button size="sm">Join group</Button>
                    )}
                  </div>

                  {isExpanded && <GroupDetailPanel group={group} />}
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Safety disclaimer */}
      <div className="flex gap-3 rounded-lg bg-muted border border-divider p-4 text-xs text-text-secondary">
        <AlertTriangle className="size-4 flex-shrink-0 text-accent-text mt-0.5" />
        <p>
          <span className="font-medium text-text-main">Disclaimer:</span> No guaranteed savings.
          Compare delivered costs including transport before committing. Cancellation terms apply.
          BuyTogether is a coordination tool only — the platform is not a party to any supplier
          agreement.
        </p>
      </div>
    </div>
  );
}
