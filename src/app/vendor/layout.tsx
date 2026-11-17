'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { VendorNavbar } from '@/components/layout/VendorNavbar';

export default function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const publicRoutes = ['/vendor/sign-in', '/vendor/register', '/vendor/reset-password'];
    if (publicRoutes.includes(pathname)) return;

    const stored = localStorage.getItem('vendor-market-user');
    if (!stored) {
      router.replace('/vendor/sign-in');
    }
  }, [pathname, router]);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <VendorNavbar />
      <main className="flex-1 lg:min-h-screen pb-16 lg:pb-0">
        {children}
      </main>
    </div>
  );
}
