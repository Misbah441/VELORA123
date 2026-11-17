import Link from 'next/link';
import { Search, MapPin, Globe, Store } from 'lucide-react';

export function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-divider shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-primary text-xl shrink-0"
          >
            <Store className="size-6" aria-hidden />
            <span>VendorMarket</span>
          </Link>

          {/* Search */}
          <div className="hidden sm:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-secondary"
                aria-hidden
              />
              <input
                type="search"
                placeholder="Search shops or products…"
                className="w-full pl-9 pr-4 py-2 rounded-md border border-divider bg-background text-text-main placeholder:text-text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-h-[44px]"
              />
            </div>
          </div>

          {/* Nav actions */}
          <nav className="flex items-center gap-2" aria-label="Site navigation">
            <button
              type="button"
              className="hidden sm:flex items-center gap-1 px-3 py-2 text-sm text-text-secondary hover:text-primary rounded-md hover:bg-muted min-h-[44px] transition-colors"
              aria-label="Select area"
            >
              <MapPin className="size-4" aria-hidden />
              <span>Area</span>
            </button>

            <button
              type="button"
              className="hidden sm:flex items-center gap-1 px-3 py-2 text-sm text-text-secondary hover:text-primary rounded-md hover:bg-muted min-h-[44px] transition-colors"
              aria-label="Change language"
            >
              <Globe className="size-4" aria-hidden />
              <span>EN</span>
            </button>

            <Link
              href="/vendor/sign-in"
              className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary hover:text-white transition-colors min-h-[44px]"
            >
              Vendor sign in
            </Link>
          </nav>
        </div>

        {/* Mobile search row */}
        <div className="sm:hidden pb-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-secondary"
              aria-hidden
            />
            <input
              type="search"
              placeholder="Search shops or products…"
              className="w-full pl-9 pr-4 py-2 rounded-md border border-divider bg-background text-text-main placeholder:text-text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
            />
          </div>
        </div>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="sm:hidden border-t border-divider"
        aria-label="Main navigation"
      >
        <div className="flex">
          {[
            { href: '/', label: 'Explore' },
            { href: '/shops', label: 'Shops' },
            { href: '/surplus', label: 'Surplus' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex items-center justify-center py-3 text-sm font-medium text-text-secondary hover:text-primary hover:bg-muted transition-colors min-h-[44px]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
