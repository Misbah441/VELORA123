'use client';

import { Heart } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function SavedPage() {
  // Saved shops are stored device-locally (localStorage)
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-text-main mb-6">Saved shops</h1>

      <EmptyState
        title="No saved shops yet"
        description="Tap the heart icon on any shop to save it here for quick access — no account needed."
        icon={<Heart />}
        action={
          <Link href="/shops">
            <Button>Browse shops</Button>
          </Link>
        }
      />
    </div>
  );
}
