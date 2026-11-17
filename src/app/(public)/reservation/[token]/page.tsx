import type { Metadata } from 'next';
import { ClipboardList } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface PageProps {
  params: { token: string };
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Reservation status' };
}

export default function ReservationTrackingPage({ params }: PageProps) {
  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="size-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
          <ClipboardList className="size-8 text-primary" aria-hidden />
        </div>
        <h1 className="text-2xl font-bold text-text-main">Reservation status</h1>
        <p className="text-text-secondary text-sm mt-1">
          Reference: <code className="text-primary font-mono">{params.token}</code>
        </p>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Status</span>
          <Badge variant="warning">Pending confirmation</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Item</span>
          <span className="text-sm font-medium text-text-main">—</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Quantity</span>
          <span className="text-sm font-medium text-text-main">—</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-secondary">Collect by</span>
          <span className="text-sm font-medium text-text-main">—</span>
        </div>

        <div className="pt-4 border-t border-divider">
          <p className="text-xs text-text-secondary">
            This page is accessible only with this private token. Do not share
            it with others. The vendor will confirm your reservation — please
            check back later.
          </p>
        </div>
      </Card>
    </div>
  );
}
