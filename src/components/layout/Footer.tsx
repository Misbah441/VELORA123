import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-surface border-t border-divider mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <p className="font-bold text-primary text-lg mb-2">VendorMarket</p>
            <p className="text-sm text-text-secondary">
              Connecting local vendors with their communities.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-text-main mb-3">Explore</h3>
            <ul className="space-y-2">
              {[
                { href: '/shops', label: 'All shops' },
                { href: '/surplus', label: 'Surplus deals' },
                { href: '/saved', label: 'Saved shops' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vendors */}
          <div>
            <h3 className="text-sm font-semibold text-text-main mb-3">Vendors</h3>
            <ul className="space-y-2">
              {[
                { href: '/vendor/sign-in', label: 'Sign in' },
                { href: '/vendor/register', label: 'Register your shop' },
                { href: '/vendor/support', label: 'Vendor support' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Language */}
          <div>
            <h3 className="text-sm font-semibold text-text-main mb-3">Language</h3>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="text-sm text-left text-text-secondary hover:text-primary transition-colors"
              >
                English
              </button>
              <button
                type="button"
                className="text-sm text-left text-text-secondary hover:text-primary transition-colors font-noto"
              >
                മലയാളം
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-divider flex flex-col sm:flex-row gap-2 justify-between text-xs text-text-secondary">
          <p>© {new Date().getFullYear()} VendorMarket. All rights reserved.</p>
          <p>Built to support local commerce.</p>
        </div>
      </div>
    </footer>
  );
}
