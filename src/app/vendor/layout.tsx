'use client';

import { VendorNavbar } from '@/components/layout/VendorNavbar';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background lg:flex">
      <VendorNavbar />
      <main className="flex-1 lg:min-h-screen pb-16 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
