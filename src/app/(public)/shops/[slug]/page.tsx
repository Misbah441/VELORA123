'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Share2,
  Check,
  ChevronLeft,
  Tag,
  Send,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { cn } from '@/lib/utils';

/* ─── Demo Data ────────────────────────────────────────────────────────────── */
interface Product {
  id: string;
  name: string;
  emoji: string;
  pricePaise: number;
  unit: string;
  available: boolean;
}

interface Shop {
  slug: string;
  name: string;
  type: string;
  area: string;
  district: string;
  description: string;
  emoji: string;
  isOpen: boolean;
  stallType: 'fixed' | 'mobile';
  mobileLocation?: string;
  mobileUpdatedMins?: number;
  contact: {
    phone?: string;
    whatsapp?: string;
    email?: string;
  };
  hours: { day: string; open: string; close: string; closed: boolean }[];
  products: Product[];
}

const DEMO_SHOPS: Shop[] = [
  {
    slug: 'amma-produce-kaloor',
    name: "Amma's Fresh Produce",
    type: 'Produce',
    area: 'Kaloor',
    district: 'Ernakulam',
    description:
      'Daily fresh vegetables and fruits sourced directly from Wayanad and local farmers. We open early so you get the freshest picks before the city wakes up.',
    emoji: '🥦',
    isOpen: true,
    stallType: 'fixed',
    contact: { phone: '+91 94470 12345', whatsapp: '+91 94470 12345' },
    hours: [
      { day: 'Mon', open: '06:00', close: '12:00', closed: false },
      { day: 'Tue', open: '06:00', close: '12:00', closed: false },
      { day: 'Wed', open: '06:00', close: '12:00', closed: false },
      { day: 'Thu', open: '06:00', close: '12:00', closed: false },
      { day: 'Fri', open: '06:00', close: '12:00', closed: false },
      { day: 'Sat', open: '06:00', close: '14:00', closed: false },
      { day: 'Sun', open: '', close: '', closed: true },
    ],
    products: [
      { id: 'p1', name: 'Country Tomatoes', emoji: '🍅', pricePaise: 4000, unit: 'kg', available: true },
      { id: 'p2', name: 'Spinach Bunch', emoji: '🥬', pricePaise: 1500, unit: 'bunch', available: true },
      { id: 'p3', name: 'Coconut', emoji: '🥥', pricePaise: 2500, unit: 'piece', available: true },
      { id: 'p4', name: 'Banana (Nendran)', emoji: '🍌', pricePaise: 6000, unit: 'kg', available: false },
      { id: 'p5', name: 'Raw Mango', emoji: '🥭', pricePaise: 8000, unit: 'kg', available: true },
      { id: 'p6', name: 'Bitter Gourd', emoji: '🫑', pricePaise: 5000, unit: 'kg', available: true },
    ],
  },
  {
    slug: 'fort-kochi-street-food',
    name: 'Fort Kochi Street Bites',
    type: 'Food Stall',
    area: 'Fort Kochi',
    district: 'Ernakulam',
    description:
      'Authentic Kerala street snacks made fresh to order. Find us near the Chinese fishing nets in the evening.',
    emoji: '🍢',
    isOpen: true,
    stallType: 'mobile',
    mobileLocation: 'Chinese Fishing Nets, Fort Kochi Beach',
    mobileUpdatedMins: 12,
    contact: { whatsapp: '+91 98470 55678' },
    hours: [
      { day: 'Mon', open: '17:00', close: '21:30', closed: false },
      { day: 'Tue', open: '17:00', close: '21:30', closed: false },
      { day: 'Wed', open: '17:00', close: '21:30', closed: false },
      { day: 'Thu', open: '17:00', close: '21:30', closed: false },
      { day: 'Fri', open: '17:00', close: '22:00', closed: false },
      { day: 'Sat', open: '16:00', close: '22:00', closed: false },
      { day: 'Sun', open: '16:00', close: '21:00', closed: false },
    ],
    products: [
      { id: 'p1', name: 'Pazham Pori', emoji: '🍌', pricePaise: 800, unit: 'piece', available: true },
      { id: 'p2', name: 'Unniyappam', emoji: '🟤', pricePaise: 500, unit: 'piece', available: true },
      { id: 'p3', name: 'Fish Fry', emoji: '🐟', pricePaise: 4000, unit: 'plate', available: true },
      { id: 'p4', name: 'Chai', emoji: '🍵', pricePaise: 1200, unit: 'cup', available: false },
    ],
  },
  {
    slug: 'palluruthy-grocery',
    name: 'Palluruthy General Store',
    type: 'Grocery',
    area: 'Palluruthy',
    district: 'Ernakulam',
    description: 'Everything you need for the household — staples, spices, cleaning supplies.',
    emoji: '🛒',
    isOpen: false,
    stallType: 'fixed',
    contact: { phone: '+91 97440 23456', email: 'palluruthy.store@example.com' },
    hours: [
      { day: 'Mon', open: '08:00', close: '20:00', closed: false },
      { day: 'Tue', open: '08:00', close: '20:00', closed: false },
      { day: 'Wed', open: '08:00', close: '20:00', closed: false },
      { day: 'Thu', open: '08:00', close: '20:00', closed: false },
      { day: 'Fri', open: '08:00', close: '20:00', closed: false },
      { day: 'Sat', open: '08:00', close: '18:00', closed: false },
      { day: 'Sun', open: '', close: '', closed: true },
    ],
    products: [
      { id: 'p1', name: 'Rice (Jyothi)', emoji: '🌾', pricePaise: 6500, unit: 'kg', available: true },
      { id: 'p2', name: 'Coconut Oil', emoji: '🫙', pricePaise: 22000, unit: 'litre', available: true },
      { id: 'p3', name: 'Black Pepper', emoji: '⚫', pricePaise: 95000, unit: 'kg', available: false },
    ],
  },
  {
    slug: 'thrissur-silks',
    name: 'Thrissur Traditional Silks',
    type: 'Clothing',
    area: 'Swaraj Round',
    district: 'Thrissur',
    description: 'Handloom sarees, kasavu mundus and traditional Kerala textiles.',
    emoji: '🧵',
    isOpen: true,
    stallType: 'fixed',
    contact: { phone: '+91 98760 34567', email: 'thrissursilks@example.com' },
    hours: [
      { day: 'Mon', open: '09:30', close: '19:00', closed: false },
      { day: 'Tue', open: '09:30', close: '19:00', closed: false },
      { day: 'Wed', open: '', close: '', closed: true },
      { day: 'Thu', open: '09:30', close: '19:00', closed: false },
      { day: 'Fri', open: '09:30', close: '19:00', closed: false },
      { day: 'Sat', open: '09:30', close: '20:00', closed: false },
      { day: 'Sun', open: '10:00', close: '18:00', closed: false },
    ],
    products: [
      { id: 'p1', name: 'Kasavu Saree', emoji: '👘', pricePaise: 450000, unit: 'piece', available: true },
      { id: 'p2', name: 'Cotton Mundu', emoji: '🩲', pricePaise: 85000, unit: 'piece', available: true },
      { id: 'p3', name: 'Silk Dupatta', emoji: '🧣', pricePaise: 120000, unit: 'piece', available: false },
    ],
  },
  {
    slug: 'kozhikode-spice-market',
    name: 'Kozhikode Spice Corner',
    type: 'Produce',
    area: 'Mittai Theruvu',
    district: 'Kozhikode',
    description: 'Premium whole spices: pepper, cardamom, cinnamon, and Malabar blends.',
    emoji: '🌶️',
    isOpen: true,
    stallType: 'fixed',
    contact: { phone: '+91 94960 45678', whatsapp: '+91 94960 45678' },
    hours: [
      { day: 'Mon', open: '09:00', close: '18:00', closed: false },
      { day: 'Tue', open: '09:00', close: '18:00', closed: false },
      { day: 'Wed', open: '09:00', close: '18:00', closed: false },
      { day: 'Thu', open: '09:00', close: '18:00', closed: false },
      { day: 'Fri', open: '09:00', close: '13:00', closed: false },
      { day: 'Sat', open: '09:00', close: '18:00', closed: false },
      { day: 'Sun', open: '', close: '', closed: true },
    ],
    products: [
      { id: 'p1', name: 'Black Pepper', emoji: '⚫', pricePaise: 110000, unit: 'kg', available: true },
      { id: 'p2', name: 'Green Cardamom', emoji: '🟢', pricePaise: 280000, unit: 'kg', available: true },
      { id: 'p3', name: 'Cinnamon Sticks', emoji: '🟫', pricePaise: 65000, unit: 'kg', available: true },
      { id: 'p4', name: 'Malabar Spice Mix', emoji: '🌶️', pricePaise: 32000, unit: 'kg', available: false },
    ],
  },
  {
    slug: 'alappuzha-seafood',
    name: 'Alappuzha Daily Catch',
    type: 'Produce',
    area: 'Mullackal',
    district: 'Alappuzha',
    description: 'Fresh fish and seafood from the backwaters — karimeen, prawns, crab.',
    emoji: '🐟',
    isOpen: true,
    stallType: 'mobile',
    mobileLocation: 'Mullackal Market, Near Bus Stand',
    mobileUpdatedMins: 5,
    contact: { whatsapp: '+91 94470 56789' },
    hours: [
      { day: 'Mon', open: '05:30', close: '10:00', closed: false },
      { day: 'Tue', open: '05:30', close: '10:00', closed: false },
      { day: 'Wed', open: '05:30', close: '10:00', closed: false },
      { day: 'Thu', open: '05:30', close: '10:00', closed: false },
      { day: 'Fri', open: '05:30', close: '10:00', closed: false },
      { day: 'Sat', open: '05:30', close: '11:00', closed: false },
      { day: 'Sun', open: '06:00', close: '10:00', closed: false },
    ],
    products: [
      { id: 'p1', name: 'Karimeen (Pearl Spot)', emoji: '🐠', pricePaise: 65000, unit: 'kg', available: true },
      { id: 'p2', name: 'Tiger Prawns', emoji: '🦐', pricePaise: 95000, unit: 'kg', available: true },
      { id: 'p3', name: 'Mud Crab', emoji: '🦀', pricePaise: 110000, unit: 'kg', available: false },
    ],
  },
  {
    slug: 'kottayam-rubber-household',
    name: 'Kottayam Home Essentials',
    type: 'Household',
    area: 'KK Road',
    district: 'Kottayam',
    description: 'Household goods, kitchenware, and rubber-based products.',
    emoji: '🏠',
    isOpen: false,
    stallType: 'fixed',
    contact: { phone: '+91 97440 67890', email: 'kottayamhome@example.com' },
    hours: [
      { day: 'Mon', open: '09:00', close: '19:00', closed: false },
      { day: 'Tue', open: '09:00', close: '19:00', closed: false },
      { day: 'Wed', open: '09:00', close: '19:00', closed: false },
      { day: 'Thu', open: '09:00', close: '19:00', closed: false },
      { day: 'Fri', open: '09:00', close: '19:00', closed: false },
      { day: 'Sat', open: '09:00', close: '17:00', closed: false },
      { day: 'Sun', open: '', close: '', closed: true },
    ],
    products: [
      { id: 'p1', name: 'Steel Pressure Cooker', emoji: '🫕', pricePaise: 189900, unit: 'piece', available: true },
      { id: 'p2', name: 'Rubber Mat', emoji: '🟫', pricePaise: 45000, unit: 'piece', available: true },
    ],
  },
  {
    slug: 'manjeri-biriyani-stall',
    name: 'Manjeri Biriyani Centre',
    type: 'Food Stall',
    area: 'Manjeri Town',
    district: 'Malappuram',
    description: 'Malabar dum biriyani, pathiri, and Kerala style chicken curries.',
    emoji: '🍛',
    isOpen: true,
    stallType: 'fixed',
    contact: { phone: '+91 94960 78901', whatsapp: '+91 94960 78901' },
    hours: [
      { day: 'Mon', open: '11:00', close: '21:00', closed: false },
      { day: 'Tue', open: '11:00', close: '21:00', closed: false },
      { day: 'Wed', open: '11:00', close: '21:00', closed: false },
      { day: 'Thu', open: '11:00', close: '21:00', closed: false },
      { day: 'Fri', open: '11:00', close: '21:30', closed: false },
      { day: 'Sat', open: '11:00', close: '22:00', closed: false },
      { day: 'Sun', open: '12:00', close: '21:00', closed: false },
    ],
    products: [
      { id: 'p1', name: 'Chicken Biriyani', emoji: '🍛', pricePaise: 18000, unit: 'plate', available: true },
      { id: 'p2', name: 'Mutton Biriyani', emoji: '🍖', pricePaise: 25000, unit: 'plate', available: true },
      { id: 'p3', name: 'Pathiri + Curry', emoji: '🫓', pricePaise: 12000, unit: 'plate', available: true },
      { id: 'p4', name: 'Malabar Halwa', emoji: '🟡', pricePaise: 6000, unit: 'piece', available: false },
    ],
  },
];

/* ─── Enquiry Form (client sub-component) ─────────────────────────────────── */
function EnquiryForm({ shopName }: { shopName: string }) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <div className="size-12 rounded-full bg-green-100 flex items-center justify-center">
          <Check className="size-6 text-primary" />
        </div>
        <p className="font-semibold text-text-main">Enquiry sent!</p>
        <p className="text-sm text-text-secondary">
          {shopName} will get back to you as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="eq-name" className="block text-sm font-medium text-text-main mb-1">
          Your name <span className="text-danger">*</span>
        </label>
        <input
          id="eq-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={cn(
            'w-full px-3 rounded-md border border-divider bg-surface text-text-main',
            'placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary',
            'min-h-[44px] text-sm'
          )}
          placeholder="Raji Menon"
        />
      </div>
      <div>
        <label htmlFor="eq-message" className="block text-sm font-medium text-text-main mb-1">
          Message <span className="text-danger">*</span>
        </label>
        <textarea
          id="eq-message"
          required
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={cn(
            'w-full px-3 py-2 rounded-md border border-divider bg-surface text-text-main',
            'placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary',
            'text-sm resize-none'
          )}
          placeholder="I'd like to enquire about availability…"
        />
      </div>
      <div>
        <label htmlFor="eq-phone" className="block text-sm font-medium text-text-main mb-1">
          Phone / Email <span className="text-text-secondary text-xs">(optional)</span>
        </label>
        <input
          id="eq-phone"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={cn(
            'w-full px-3 rounded-md border border-divider bg-surface text-text-main',
            'placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary',
            'min-h-[44px] text-sm'
          )}
          placeholder="+91 98765 43210"
        />
      </div>
      <Button type="submit" fullWidth isLoading={loading}>
        <Send className="size-4" />
        Send enquiry
      </Button>
    </form>
  );
}

/* ─── Shop Detail Page ────────────────────────────────────────────────────── */
export default function ShopDetailPage({ params }: { params: { slug: string } }) {
  const shop = DEMO_SHOPS.find((s) => s.slug === params.slug);
  const [copied, setCopied] = useState(false);

  if (!shop) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <ErrorState
            title="Shop not found"
            description="We couldn't find a shop with that link. It may have been removed or the URL is incorrect."
            action={
              <Link href="/shops" className="text-primary underline text-sm">
                ← Back to all shops
              </Link>
            }
          />
        </div>
      </main>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="min-h-screen bg-background pb-12">
      {/* Back link */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <Link
          href="/shops"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary"
        >
          <ChevronLeft className="size-4" /> All shops
        </Link>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 mt-4">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            {/* Emoji avatar */}
            <div className="flex-shrink-0 size-24 rounded-xl bg-muted flex items-center justify-center text-5xl">
              {shop.emoji}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant={shop.isOpen ? 'success' : 'muted'}>
                  <Clock className="size-3" />
                  {shop.isOpen ? 'Open now' : 'Closed'}
                </Badge>
                <Badge variant="default">
                  <Tag className="size-3" />
                  {shop.type}
                </Badge>
                {shop.stallType === 'mobile' && <Badge variant="info">🚶 Mobile vendor</Badge>}
              </div>

              <h1 className="text-2xl font-bold text-text-main">{shop.name}</h1>
              <div className="flex items-center gap-1 text-text-secondary text-sm mt-1">
                <MapPin className="size-4 shrink-0" />
                {shop.area}, {shop.district}
              </div>
              <p className="text-text-secondary text-sm mt-3">{shop.description}</p>

              {/* Contact icons */}
              <div className="flex flex-wrap gap-2 mt-4">
                {shop.contact.phone && (
                  <a
                    href={`tel:${shop.contact.phone}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-muted text-primary text-sm hover:bg-primary hover:text-white transition-colors min-h-[40px]"
                  >
                    <Phone className="size-4" />
                    Call
                  </a>
                )}
                {shop.contact.whatsapp && (
                  <a
                    href={`https://wa.me/${shop.contact.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-green-100 text-primary text-sm hover:bg-primary hover:text-white transition-colors min-h-[40px]"
                  >
                    <MessageCircle className="size-4" />
                    WhatsApp
                  </a>
                )}
                {shop.contact.email && (
                  <a
                    href={`mailto:${shop.contact.email}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-muted text-primary text-sm hover:bg-primary hover:text-white transition-colors min-h-[40px]"
                  >
                    <Mail className="size-4" />
                    Email
                  </a>
                )}
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-muted text-text-secondary text-sm hover:bg-muted transition-colors min-h-[40px]"
                >
                  {copied ? <Check className="size-4 text-primary" /> : <Share2 className="size-4" />}
                  {copied ? 'Copied!' : 'Share'}
                </button>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Mobile vendor banner */}
      {shop.stallType === 'mobile' && shop.mobileLocation && (
        <div className="max-w-4xl mx-auto px-4 mt-4">
          <div className="bg-accent-surface border border-amber-200 rounded-lg px-4 py-3 text-sm text-accent-text flex items-start gap-2">
            <MapPin className="size-4 shrink-0 mt-0.5" />
            <span>
              <strong>Currently near</strong> {shop.mobileLocation} — updated{' '}
              {shop.mobileUpdatedMins} minutes ago
            </span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 mt-6 grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hours */}
          <Card>
            <h2 className="text-lg font-semibold text-text-main mb-4">Opening hours</h2>
            <table className="w-full text-sm">
              <tbody>
                {shop.hours.map(({ day, open, close, closed }) => (
                  <tr key={day} className="border-b border-divider last:border-0">
                    <td className="py-2 font-medium text-text-main w-12">{day}</td>
                    <td className="py-2 text-text-secondary">
                      {closed ? (
                        <span className="text-danger">Closed</span>
                      ) : (
                        `${open} – ${close}`
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Products */}
          <div>
            <h2 className="text-lg font-semibold text-text-main mb-3">Products available</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {shop.products.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${shop.slug}-${p.id}`}
                  className="block group"
                >
                  <Card className={cn('h-full', !p.available && 'opacity-60')}>
                    <div className="rounded-md bg-muted flex items-center justify-center h-16 text-4xl mb-2">
                      {p.emoji}
                    </div>
                    <p className="text-sm font-medium text-text-main group-hover:text-primary transition-colors line-clamp-2">
                      {p.name}
                    </p>
                    <p className="text-sm text-primary font-semibold mt-1">
                      ₹{(p.pricePaise / 100).toFixed(2)}/{p.unit}
                    </p>
                    <Badge variant={p.available ? 'success' : 'muted'} className="mt-1">
                      {p.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — Enquiry */}
        <div>
          <Card className="sticky top-4">
            <h2 className="text-lg font-semibold text-text-main mb-4">Send an enquiry</h2>
            <EnquiryForm shopName={shop.name} />
          </Card>
        </div>
      </div>
    </main>
  );
}
