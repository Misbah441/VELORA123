import Link from 'next/link';
import { ChevronLeft, Tag, MapPin, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';

interface DemoProduct {
  id: string;
  shopSlug: string;
  shopName: string;
  shopArea: string;
  name: string;
  emoji: string;
  pricePaise: number;
  unit: string;
  available: boolean;
  description: string;
  category: string;
  surplusLink?: boolean;
}

const DEMO_PRODUCTS: DemoProduct[] = [
  {
    id: 'amma-produce-kaloor-p1',
    shopSlug: 'amma-produce-kaloor',
    shopName: "Amma's Fresh Produce",
    shopArea: 'Kaloor, Ernakulam',
    name: 'Country Tomatoes',
    emoji: '🍅',
    pricePaise: 4000,
    unit: 'kg',
    available: true,
    description:
      'Locally grown country tomatoes, picked fresh every morning from Wayanad farms. Perfect for sambar, curries, and chutneys. No preservatives or artificial ripening agents.',
    category: 'Produce',
  },
  {
    id: 'amma-produce-kaloor-p2',
    shopSlug: 'amma-produce-kaloor',
    shopName: "Amma's Fresh Produce",
    shopArea: 'Kaloor, Ernakulam',
    name: 'Spinach Bunch',
    emoji: '🥬',
    pricePaise: 1500,
    unit: 'bunch',
    available: true,
    description:
      'Fresh spinach bunches, hand-picked and washed. Rich in iron and vitamins. Best consumed within 2 days of purchase.',
    category: 'Produce',
  },
  {
    id: 'amma-produce-kaloor-p3',
    shopSlug: 'amma-produce-kaloor',
    shopName: "Amma's Fresh Produce",
    shopArea: 'Kaloor, Ernakulam',
    name: 'Coconut',
    emoji: '🥥',
    pricePaise: 2500,
    unit: 'piece',
    available: true,
    description:
      'Freshly harvested Kerala coconuts. Great for coconut milk, chutney, and traditional Kerala recipes. Medium size, full of water.',
    category: 'Produce',
  },
  {
    id: 'amma-produce-kaloor-p5',
    shopSlug: 'amma-produce-kaloor',
    shopName: "Amma's Fresh Produce",
    shopArea: 'Kaloor, Ernakulam',
    name: 'Raw Mango',
    emoji: '🥭',
    pricePaise: 8000,
    unit: 'kg',
    available: true,
    description:
      'Sour raw mangoes from local orchards. Ideal for making mango pickle (achar), raw mango curry, and refreshing drinks.',
    category: 'Produce',
    surplusLink: true,
  },
  {
    id: 'fort-kochi-street-food-p1',
    shopSlug: 'fort-kochi-street-food',
    shopName: 'Fort Kochi Street Bites',
    shopArea: 'Fort Kochi, Ernakulam',
    name: 'Pazham Pori',
    emoji: '🍌',
    pricePaise: 800,
    unit: 'piece',
    available: true,
    description:
      'Crispy deep-fried banana fritters made with ripe Nendran bananas and a lightly spiced batter. The quintessential Kerala evening snack.',
    category: 'Food',
  },
  {
    id: 'fort-kochi-street-food-p3',
    shopSlug: 'fort-kochi-street-food',
    shopName: 'Fort Kochi Street Bites',
    shopArea: 'Fort Kochi, Ernakulam',
    name: 'Fish Fry',
    emoji: '🐟',
    pricePaise: 4000,
    unit: 'plate',
    available: true,
    description:
      'Marinated fish fillets pan-fried in coconut oil with Kerala spices. Served with sliced onion, lemon, and green chilli.',
    category: 'Food',
    surplusLink: true,
  },
  {
    id: 'kozhikode-spice-market-p1',
    shopSlug: 'kozhikode-spice-market',
    shopName: 'Kozhikode Spice Corner',
    shopArea: 'Mittai Theruvu, Kozhikode',
    name: 'Black Pepper',
    emoji: '⚫',
    pricePaise: 110000,
    unit: 'kg',
    available: true,
    description:
      'Premium Malabar black pepper, sun-dried and hand-sorted. Pungent aroma with complex heat. The king of spices from the Spice Coast of Kerala.',
    category: 'Produce',
    surplusLink: true,
  },
  {
    id: 'alappuzha-seafood-p1',
    shopSlug: 'alappuzha-seafood',
    shopName: 'Alappuzha Daily Catch',
    shopArea: 'Mullackal, Alappuzha',
    name: 'Karimeen (Pearl Spot)',
    emoji: '🐠',
    pricePaise: 65000,
    unit: 'kg',
    available: true,
    description:
      'The state fish of Kerala — fresh pearl spot from Vembanad Lake. Best cooked in a banana leaf (Karimeen Pollichathu) or as a simple curry with kokum.',
    category: 'Produce',
  },
  {
    id: 'manjeri-biriyani-stall-p1',
    shopSlug: 'manjeri-biriyani-stall',
    shopName: 'Manjeri Biriyani Centre',
    shopArea: 'Manjeri Town, Malappuram',
    name: 'Chicken Biriyani',
    emoji: '🍛',
    pricePaise: 18000,
    unit: 'plate',
    available: true,
    description:
      'Aromatic Malabar dum biriyani slow-cooked with Jeerakasala rice, tender chicken, and a blend of whole spices. Served with raita, pickle, and boiled egg.',
    category: 'Food',
  },
  {
    id: 'thrissur-silks-p1',
    shopSlug: 'thrissur-silks',
    shopName: 'Thrissur Traditional Silks',
    shopArea: 'Swaraj Round, Thrissur',
    name: 'Kasavu Saree',
    emoji: '👘',
    pricePaise: 450000,
    unit: 'piece',
    available: true,
    description:
      'Hand-woven pure cotton saree with traditional golden kasavu border. The epitome of Kerala heritage, worn on Onam, weddings, and festivals.',
    category: 'Clothing',
  },
];

function getRelated(product: DemoProduct): DemoProduct[] {
  return DEMO_PRODUCTS.filter(
    (p) => p.shopSlug === product.shopSlug && p.id !== product.id
  ).slice(0, 3);
}

const categoryBg: Record<string, string> = {
  Produce: 'bg-green-100',
  Food: 'bg-amber-50',
  Clothing: 'bg-purple-50',
  Grocery: 'bg-blue-50',
  Household: 'bg-gray-100',
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = DEMO_PRODUCTS.find((p) => p.id === params.id);

  if (!product) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-4">
        <ErrorState
          title="Product not found"
          description="This product listing may have been removed or the link is incorrect."
          action={
            <Link href="/shops" className="text-primary underline text-sm">
              ← Browse all shops
            </Link>
          }
        />
      </main>
    );
  }

  const related = getRelated(product);
  const bgClass = categoryBg[product.category] ?? 'bg-muted';

  return (
    <main className="min-h-screen bg-background pb-12">
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <Link
          href={`/shops/${product.shopSlug}`}
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary"
        >
          <ChevronLeft className="size-4" /> Back to {product.shopName}
        </Link>
      </div>

      <section className="max-w-3xl mx-auto px-4 mt-4">
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Product image placeholder */}
          <div
            className={cn(
              'rounded-lg h-64 flex items-center justify-center text-8xl',
              bgClass
            )}
          >
            {product.emoji}
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <Badge variant="default" className="mb-2">
                <Tag className="size-3" />
                {product.category}
              </Badge>
              <h1 className="text-2xl font-bold text-text-main">{product.name}</h1>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary tabular-nums">
                ₹{(product.pricePaise / 100).toFixed(2)}
              </span>
              <span className="text-text-secondary text-sm">/ {product.unit}</span>
            </div>

            <Badge variant={product.available ? 'success' : 'muted'}>
              {product.available ? '✓ Available' : 'Currently unavailable'}
            </Badge>

            <div className="flex items-center gap-1.5 text-sm text-text-secondary">
              <MapPin className="size-4 shrink-0" />
              <span>Sold by </span>
              <Link href={`/shops/${product.shopSlug}`} className="text-primary hover:underline font-medium">
                {product.shopName}
              </Link>
              <span>· {product.shopArea}</span>
            </div>

            <p className="text-text-secondary text-sm leading-relaxed">{product.description}</p>

            {/* CTA */}
            <div className="flex flex-col gap-2 pt-2">
              {product.surplusLink ? (
                <Link href="/surplus">
                  <Button fullWidth>
                    <ShoppingBag className="size-4" />
                    View surplus deals
                  </Button>
                </Link>
              ) : (
                <Link href={`/shops/${product.shopSlug}`}>
                  <Button fullWidth>
                    <ShoppingBag className="size-4" />
                    Enquire at shop
                  </Button>
                </Link>
              )}
              <Link href={`/shops/${product.shopSlug}`}>
                <Button variant="secondary" fullWidth>
                  View shop details
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-text-main mb-4">
              More from {product.shopName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/products/${r.id}`} className="block group">
                  <Card className={cn('h-full', !r.available && 'opacity-60')}>
                    <div className="rounded-md bg-muted flex items-center justify-center h-16 text-4xl mb-2">
                      {r.emoji}
                    </div>
                    <p className="text-sm font-medium text-text-main group-hover:text-primary transition-colors">
                      {r.name}
                    </p>
                    <p className="text-sm font-semibold text-primary mt-0.5 tabular-nums">
                      ₹{(r.pricePaise / 100).toFixed(2)}/{r.unit}
                    </p>
                    <Badge variant={r.available ? 'success' : 'muted'} className="mt-1">
                      {r.available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
