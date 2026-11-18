'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Smartphone,
  ShoppingBag,
  Clock,
  PlusCircle,
  Tag,
  Eye,
  Package,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

// ─── Demo Data ────────────────────────────────────────────────────────────────

const statCards = [
  {
    label: 'Cash in hand',
    value: '₹2,450',
    icon: TrendingUp,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    valueColor: 'text-green-700',
  },
  {
    label: 'UPI received',
    value: '₹1,200',
    icon: Smartphone,
    iconColor: 'text-information',
    iconBg: 'bg-blue-100',
    valueColor: 'text-information',
  },
  {
    label: 'Total sales today',
    value: '₹3,650',
    icon: ShoppingBag,
    iconColor: 'text-primary',
    iconBg: 'bg-muted',
    valueColor: 'text-primary',
  },
  {
    label: 'Pending reservations',
    value: '2',
    icon: Clock,
    iconColor: 'text-accent-text',
    iconBg: 'bg-accent-surface',
    valueColor: 'text-accent-text',
  },
];

const quickActions = [
  {
    label: 'Record a sale',
    href: '/vendor/book',
    icon: PlusCircle,
    isPrimary: true,
    description: 'Add a new ledger entry',
  },
  {
    label: 'List surplus stock',
    href: '/vendor/surplus',
    icon: Tag,
    isPrimary: false,
    description: 'Post leftover produce',
  },
  {
    label: 'View my shop',
    href: '/shops/rajan-vegetables',
    icon: Eye,
    isPrimary: false,
    description: 'Public shop page',
  },
  {
    label: 'Manage products',
    href: '/vendor/shop',
    icon: Package,
    isPrimary: false,
    description: 'Edit listings & prices',
  },
];

const pendingTasks = [
  { text: '2 reservation requests waiting', href: '/vendor/reservations', linkLabel: 'Review →' },
  { text: '1 enquiry unanswered', href: '/vendor/enquiries', linkLabel: 'Reply →' },
  { text: 'Stock update: 3 products marked unavailable', href: null, linkLabel: null, note: 'Manual check reminder' },
];

type EntryType = 'Sale' | 'Expense' | 'Purchase';
type Method = 'Cash' | 'UPI';

interface LedgerEntry {
  date: string;
  type: EntryType;
  description: string;
  amount: number; // positive = inflow, negative = outflow
  method: Method;
}

const recentEntries: LedgerEntry[] = [
  { date: 'Today 10:12', type: 'Sale', description: 'Tomatoes 2 kg', amount: 120, method: 'Cash' },
  { date: 'Today 10:45', type: 'Sale', description: 'Spinach 500 g', amount: 40, method: 'UPI' },
  { date: 'Today 11:30', type: 'Purchase', description: 'Wholesale bananas', amount: -600, method: 'Cash' },
  { date: 'Today 12:05', type: 'Sale', description: 'Bitter gourd 1 kg', amount: 80, method: 'Cash' },
  { date: 'Today 13:20', type: 'Expense', description: 'Transport cost', amount: -50, method: 'Cash' },
];

const typeBadgeVariant: Record<EntryType, 'success' | 'warning' | 'info'> = {
  Sale: 'success',
  Expense: 'warning',
  Purchase: 'info',
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VendorDashboardPage() {
  const [vendorName, setVendorName] = useState('Vendor');

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      const name = data.user?.user_metadata?.display_name;
      if (typeof name === 'string' && name.trim()) setVendorName(name.trim());
    });
  }, []);

  return (
    <div className="min-h-screen bg-background px-4 py-6 max-w-3xl mx-auto space-y-8">

      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-text-main">Good morning, {vendorName} 👋</h1>
        <p className="text-text-secondary text-sm mt-1">Here&apos;s what&apos;s happening with your shop today.</p>
      </div>

      {/* TODAY'S SUMMARY */}
      <section>
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Today&apos;s Summary
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.label} className="p-4 flex flex-col gap-2">
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', card.iconBg)}>
                  <Icon className={cn('w-5 h-5', card.iconColor)} />
                </div>
                <p className={cn('text-xl font-bold tabular-nums', card.valueColor)}>{card.value}</p>
                <p className="text-xs text-text-secondary leading-tight">{card.label}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* QUICK ACTIONS */}
      <section>
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.label} href={action.href}>
                <Card className="p-4 h-full flex flex-col gap-2 hover:border-primary/40 transition-colors cursor-pointer">
                  <div className={cn(
                    'w-9 h-9 rounded-lg flex items-center justify-center',
                    action.isPrimary ? 'bg-primary' : 'bg-muted'
                  )}>
                    <Icon className={cn('w-5 h-5', action.isPrimary ? 'text-white' : 'text-primary')} />
                  </div>
                  <p className="text-sm font-semibold text-text-main">{action.label}</p>
                  <p className="text-xs text-text-secondary">{action.description}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* PENDING TASKS */}
      <section>
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Pending Tasks
        </h2>
        <div className="rounded-lg border border-amber-200 bg-accent-surface p-4 space-y-3">
          {pendingTasks.map((task, i) => (
            <div key={i} className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-accent-text mt-0.5 shrink-0" />
              <div className="flex-1">
                <span className="text-sm text-text-main">{task.text}</span>
                {task.note && (
                  <span className="ml-2 text-xs text-text-secondary">({task.note})</span>
                )}
              </div>
              {task.href && task.linkLabel && (
                <Link
                  href={task.href}
                  className="text-xs font-semibold text-accent-text hover:underline whitespace-nowrap"
                >
                  {task.linkLabel}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* RECENT ACTIVITY */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Recent Activity
          </h2>
          <Link href="/vendor/book" className="text-xs font-semibold text-primary hover:underline">
            View all entries →
          </Link>
        </div>
        <Card padded={false} className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-divider bg-muted/40">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary">Date</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary">Type</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary">Description</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-text-secondary">Amount</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-text-secondary">Method</th>
                </tr>
              </thead>
              <tbody>
                {recentEntries.map((entry, i) => (
                  <tr
                    key={i}
                    className="border-b border-divider last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-text-secondary whitespace-nowrap">{entry.date}</td>
                    <td className="px-4 py-3">
                      <Badge variant={typeBadgeVariant[entry.type]}>{entry.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-text-main">{entry.description}</td>
                    <td className={cn(
                      'px-4 py-3 text-right tabular-nums font-semibold whitespace-nowrap',
                      entry.amount > 0 ? 'text-green-700' : 'text-danger'
                    )}>
                      {entry.amount > 0 ? (
                        <span className="inline-flex items-center gap-0.5">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          ₹{Math.abs(entry.amount)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5">
                          <ArrowDownRight className="w-3.5 h-3.5" />
                          ₹{Math.abs(entry.amount)}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={entry.method === 'Cash' ? 'muted' : 'info'}>{entry.method}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* SHOP STATUS */}
      <section>
        <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Shop Status
        </h2>
        <Card className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-text-main">Rajan&apos;s Vegetables</p>
                <Badge variant="success">
                  <CheckCircle2 className="w-3 h-3" />
                  Published
                </Badge>
              </div>
              <p className="text-xs text-text-secondary">Last updated: 2 hours ago</p>
              {/* Decorative open/closed toggle */}
              <div className="flex items-center gap-1.5 pt-1">
                <div className="w-9 h-5 rounded-full bg-primary flex items-center px-0.5">
                  <div className="w-4 h-4 bg-white rounded-full translate-x-4 transition-transform" />
                </div>
                <span className="text-xs font-medium text-primary">Open</span>
              </div>
            </div>
            <Link href="/vendor/shop">
              <Button variant="ghost" size="sm">
                Manage shop
              </Button>
            </Link>
          </div>
          <div className="mt-3 pt-3 border-t border-divider">
            <Link
              href="/shops/rajan-vegetables"
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              <Eye className="w-3 h-3" />
              View public shop page
            </Link>
          </div>
        </Card>
      </section>

    </div>
  );
}
