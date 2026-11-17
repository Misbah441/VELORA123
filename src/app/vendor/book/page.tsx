import type { Metadata } from 'next';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Business Book',
};

const ENTRY_TYPES = ['Sale', 'Purchase/Expense', 'Withdrawal', 'Credit given', 'Credit repaid'];

export default function BusinessBookPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Daily Business Book</h1>
          <p className="text-text-secondary text-sm mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" aria-hidden />
          Add entry
        </Button>
      </div>

      {/* Daily summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <Card className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingUp className="size-4 text-primary" aria-hidden />
            <p className="text-xs text-text-secondary">Total sales</p>
          </div>
          <p className="text-2xl font-bold text-primary tabular-nums">₹0.00</p>
        </Card>
        <Card className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <TrendingDown className="size-4 text-danger" aria-hidden />
            <p className="text-xs text-text-secondary">Expenses</p>
          </div>
          <p className="text-2xl font-bold text-danger tabular-nums">₹0.00</p>
        </Card>
        <Card className="text-center col-span-2 sm:col-span-1">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Wallet className="size-4 text-information" aria-hidden />
            <p className="text-xs text-text-secondary">Cash in hand</p>
          </div>
          <p className="text-2xl font-bold text-information tabular-nums">₹0.00</p>
        </Card>
      </div>

      {/* Entry type filter */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {['All', ...ENTRY_TYPES].map((type) => (
          <button
            key={type}
            type="button"
            className="shrink-0 px-3 py-1.5 rounded-full text-sm border border-divider bg-surface hover:bg-primary hover:text-white hover:border-primary transition-colors min-h-[36px]"
          >
            {type}
          </button>
        ))}
      </div>

      {/* Entries */}
      <Card>
        <div className="text-center py-12 space-y-2">
          <p className="text-text-secondary">No entries today yet.</p>
          <p className="text-sm text-text-secondary">
            Add a sale, expense, or other record to get started.
          </p>
        </div>
      </Card>

      {/* Export note */}
      <p className="text-xs text-text-secondary mt-4">
        CSV export is available from the weekly and monthly views. Financial
        records are private and visible only to you.
      </p>
    </div>
  );
}
