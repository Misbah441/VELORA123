'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  ShoppingBag,
  Tag,
  Users,
  HelpCircle,
  Bell,
  Settings,
  Store,
  ClipboardList,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/vendor', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/vendor/book', label: 'Business Book', icon: BookOpen },
  { href: '/vendor/shop', label: 'My Shop', icon: Store },
  { href: '/vendor/surplus', label: 'Surplus', icon: Tag },
  { href: '/vendor/buy-together', label: 'BuyTogether', icon: Users },
  { href: '/vendor/reservations', label: 'Reservations', icon: ClipboardList },
  { href: '/vendor/enquiries', label: 'Enquiries', icon: MessageSquare },
  { href: '/vendor/support', label: 'Support', icon: HelpCircle },
  { href: '/vendor/notifications', label: 'Notifications', icon: Bell },
  { href: '/vendor/settings', label: 'Settings', icon: Settings },
];

export function VendorNavbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-surface border-r border-divider">
        {/* Logo */}
        <div className="p-4 border-b border-divider">
          <Link
            href="/vendor"
            className="flex items-center gap-2 font-bold text-primary text-lg"
          >
            <Store className="size-6" aria-hidden />
            <span>VendorMarket</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2" aria-label="Vendor navigation">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors mb-1 min-h-[44px]',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-muted hover:text-text-main'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="size-4 shrink-0" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer link to public view */}
        <div className="p-4 border-t border-divider">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
          >
            <ShoppingBag className="size-4" aria-hidden />
            View public marketplace
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-50 bg-surface border-b border-divider">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/vendor" className="font-bold text-primary flex items-center gap-2">
            <Store className="size-5" aria-hidden />
            Vendor
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/vendor/notifications"
              className="p-2 text-text-secondary hover:text-primary rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Notifications"
            >
              <Bell className="size-5" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile bottom navigation */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-divider"
        aria-label="Vendor mobile navigation"
      >
        <div className="flex">
          {[
            { href: '/vendor', label: 'Home', icon: LayoutDashboard, exact: true },
            { href: '/vendor/book', label: 'Book', icon: BookOpen },
            { href: '/vendor/shop', label: 'Shop', icon: Store },
            { href: '/vendor/surplus', label: 'Surplus', icon: Tag },
          ].map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors min-h-[56px]',
                  isActive ? 'text-primary' : 'text-text-secondary'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon className="size-5" aria-hidden />
                {item.label}
              </Link>
            );
          })}
          <button
            type="button"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium text-text-secondary min-h-[56px]"
          >
            <Settings className="size-5" aria-hidden />
            More
          </button>
        </div>
      </nav>
    </>
  );
}
