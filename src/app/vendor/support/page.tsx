'use client';

import { useState } from 'react';
import { ExternalLink, Info, Search } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

type ResourceCategory = 'Schemes' | 'Licensing' | 'FSSAI' | 'Local rules' | 'Contacts';
type TabFilter = 'All' | ResourceCategory;

interface Resource {
  id: string;
  title: string;
  titleMl?: string;
  category: ResourceCategory;
  jurisdiction: string;
  description: string;
  descriptionMl?: string;
  sourceUrl: string;
  sourceDomain: string;
  verifiedDate: string;
  verifiedBy: string;
}

const resources: Resource[] = [
  {
    id: 'r1',
    title: 'PM SVANidhi Scheme',
    titleMl: 'പിഎം സ്വനിധി പദ്ധതി',
    category: 'Schemes',
    jurisdiction: 'National',
    description:
      'Working capital loans for street vendors. Provides collateral-free loans of ₹10,000–₹50,000 with interest subsidy.',
    descriptionMl: 'തെരുവ് കച്ചവടക്കാർക്ക് മൂലധന വായ്പ.',
    sourceUrl: 'https://pmsvanidhi.mohua.gov.in',
    sourceDomain: 'pmsvanidhi.mohua.gov.in',
    verifiedDate: 'Nov 2024',
    verifiedBy: 'admin@platform',
  },
  {
    id: 'r2',
    title: 'Street Vendors Act, 2014',
    category: 'Licensing',
    jurisdiction: 'National',
    description:
      'Rights and protections for street vendors including Town Vending Committees. Outlines registration, certificate of vending, and dispute resolution.',
    sourceUrl: 'https://indiacode.nic.in',
    sourceDomain: 'indiacode.nic.in',
    verifiedDate: 'Oct 2024',
    verifiedBy: 'admin@platform',
  },
  {
    id: 'r3',
    title: 'FSSAI Registration for Small Vendors',
    titleMl: 'ചെറുകിട കച്ചവടക്കാർക്കുള്ള FSSAI രജിസ്ട്രേഷൻ',
    category: 'FSSAI',
    jurisdiction: 'National',
    description:
      'Food safety requirements for vendors with annual turnover below ₹12 lakh. Basic registration is free and mandatory.',
    sourceUrl: 'https://fssai.gov.in',
    sourceDomain: 'fssai.gov.in',
    verifiedDate: 'Sep 2024',
    verifiedBy: 'admin@platform',
  },
  {
    id: 'r4',
    title: 'Kerala Municipality Act Provisions',
    titleMl: 'കേരള മുനിസിപ്പാലിറ്റി ആക്ട്',
    category: 'Local rules',
    jurisdiction: 'Kerala',
    description:
      'Local body vending zone requirements under the Kerala Municipality Act. Covers designated vending areas and local licensing.',
    sourceUrl: 'https://lsgkerala.gov.in',
    sourceDomain: 'lsgkerala.gov.in',
    verifiedDate: 'Aug 2024',
    verifiedBy: 'admin@platform',
  },
  {
    id: 'r5',
    title: 'Ernakulam Corporation Vendor Contacts',
    category: 'Contacts',
    jurisdiction: 'Ernakulam',
    description:
      'Town Vending Committee contact details for Ernakulam district. For complaints, vending zone allotment and certificate renewal.',
    sourceUrl: 'https://corporation.cochin.kerala.gov.in',
    sourceDomain: 'corporation.cochin.kerala.gov.in',
    verifiedDate: 'Nov 2024',
    verifiedBy: 'admin@platform',
  },
  {
    id: 'r6',
    title: 'Pradhan Mantri Jeevan Jyoti Bima Yojana',
    titleMl: 'പ്രധാനമന്ത്രി ജീവൻ ജ്യോതി ബീമ യോജന',
    category: 'Schemes',
    jurisdiction: 'National',
    description:
      'Life insurance scheme for informal sector workers. ₹2 lakh cover at ₹436/year. Enrol through any bank or post office.',
    sourceUrl: 'https://jansuraksha.gov.in',
    sourceDomain: 'jansuraksha.gov.in',
    verifiedDate: 'Oct 2024',
    verifiedBy: 'admin@platform',
  },
];

const categoryBadgeVariant: Record<ResourceCategory, 'success' | 'info' | 'warning' | 'muted' | 'danger'> = {
  Schemes: 'success',
  Licensing: 'info',
  FSSAI: 'warning',
  'Local rules': 'muted',
  Contacts: 'danger',
};

const tabs: TabFilter[] = ['All', 'Schemes', 'Licensing', 'FSSAI', 'Local rules', 'Contacts'];

function jurisdictionBadge(j: string) {
  if (j === 'National') return <Badge variant="info">{j}</Badge>;
  if (j === 'Kerala') return <Badge variant="success">{j}</Badge>;
  return <Badge variant="muted">{j}</Badge>;
}

export default function SupportPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabFilter>('All');

  const filtered = resources.filter((r) => {
    const matchesTab = activeTab === 'All' || r.category === activeTab;
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.jurisdiction.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q);
    return matchesTab && matchesQuery;
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-main">Vendor Rights &amp; Support</h1>
        <p className="text-text-secondary mt-1">
          Official schemes, guidance and contacts — English and Malayalam
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-secondary pointer-events-none" />
        <Input
          placeholder="Search schemes, rights, contacts…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Disclaimer */}
      <div className="flex gap-3 rounded-lg border border-information bg-blue-50 p-4 text-sm text-information">
        <Info className="size-5 flex-shrink-0 mt-0.5" />
        <p>
          This information is for general guidance only. Verify current details through official
          government sources. The platform makes no eligibility determination.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[36px]',
              activeTab === tab
                ? 'bg-primary text-white'
                : 'bg-muted text-text-secondary hover:bg-divider'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Resource cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="py-12 text-center text-text-secondary">
            <p className="text-lg font-medium">No resources found</p>
            <p className="text-sm mt-1">Try a different search or category filter.</p>
          </div>
        )}
        {filtered.map((r) => (
          <Card key={r.id}>
            <div className="flex flex-col gap-3">
              {/* Title row */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-text-main">{r.title}</h3>
                  {r.titleMl && (
                    <p className="text-sm text-text-secondary mt-0.5">{r.titleMl}</p>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 flex-shrink-0">
                  <Badge variant={categoryBadgeVariant[r.category]}>{r.category}</Badge>
                  {jurisdictionBadge(r.jurisdiction)}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-text-secondary">{r.description}</p>
              {r.descriptionMl && (
                <p className="text-sm text-text-secondary italic">{r.descriptionMl}</p>
              )}

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-divider">
                <a
                  href={r.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-information hover:underline"
                >
                  <ExternalLink className="size-3.5" />
                  {r.sourceDomain}
                </a>
                <span className="text-xs text-text-secondary">
                  Verified {r.verifiedDate} · {r.verifiedBy}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Submit correction */}
      <p className="text-sm text-text-secondary text-center pt-2">
        Found outdated information?{' '}
        <a
          href="mailto:corrections@vendorspace.example.com?subject=Resource+correction"
          className="text-primary underline underline-offset-2 hover:text-primary/80"
        >
          Submit a correction
        </a>
      </p>
    </div>
  );
}
