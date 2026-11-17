import type { Metadata } from 'next';
import { Inter, Noto_Sans_Malayalam } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const notoMalayalam = Noto_Sans_Malayalam({
  subsets: ['malayalam'],
  variable: '--font-malayalam',
});

export const metadata: Metadata = {
  title: {
    default: 'VendorMarket — Support Local',
    template: '%s | VendorMarket',
  },
  description:
    'Discover local shops, fresh produce, and surplus deals from street vendors and neighbourhood businesses near you.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoMalayalam.variable}`}>
      <body>{children}</body>
    </html>
  );
}
