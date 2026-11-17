import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { Plus, Tag } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export const metadata: Metadata = {
  title: 'Surplus Management',
};

export default function VendorSurplusPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Surplus listings</h1>
          <p className="text-text-secondary text-sm mt-1">
            Publish discounted stock before it expires
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" aria-hidden />
          New listing
        </Button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-6">
        {['Active', 'Closed', 'Expired'].map((status) => (
          <button
            key={status}
            type="button"
            className="px-4 py-2 text-sm rounded-md border border-divider bg-surface hover:bg-muted transition-colors min-h-[44px]"
          >
            {status}
          </button>
        ))}
      </div>

      <EmptyState
        title="No surplus listings yet"
        description="When you have stock to sell before closing, create a listing here with a discount price and collection deadline."
        icon={<Tag />}
        action={<Button className="gap-2"><Plus className="size-4" />Create listing</Button>}
      />
    </div>
  );
}
