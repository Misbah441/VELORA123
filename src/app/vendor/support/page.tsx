'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Info, Search } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';

interface ResourceRow {
  id: string;
  title: string;
  title_ml: string | null;
  description: string;
  description_ml: string | null;
  official_url: string;
  jurisdiction: string;
  tags: string[];
  reviewer: string;
  verified_at: string;
}

export default function SupportPage() {
  const [resources, setResources] = useState<ResourceRow[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    void supabase
      .from('support_resources')
      .select('id,title,title_ml,description,description_ml,official_url,jurisdiction,tags,reviewer,verified_at')
      .eq('is_published', true)
      .order('verified_at', { ascending: false })
      .then(({ data }) => {
        setResources((data || []) as unknown as ResourceRow[]);
        setLoading(false);
      });
  }, []);

  const needle = query.trim().toLowerCase();
  const filtered = resources.filter((resource) =>
    !needle ||
    [resource.title, resource.title_ml, resource.description, resource.description_ml, resource.jurisdiction, ...(resource.tags || [])]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(needle)
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Vendor Rights &amp; Support</h1>
        <p className="text-text-secondary mt-1">Verified guidance and official contacts.</p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-secondary" />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search schemes, rights, contacts…" className="pl-9" />
      </div>
      <div className="flex gap-3 rounded-lg border border-information bg-blue-50 p-4 text-sm text-information">
        <Info className="size-5 flex-shrink-0" />
        <p>General guidance only. Verify current details through official government sources. No eligibility determination is made.</p>
      </div>
      {loading ? (
        <p className="text-sm text-text-secondary">Loading support resources...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-text-secondary text-center py-12">No published resources match your search.</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((resource) => (
            <Card key={resource.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{resource.title}</h2>
                  {resource.title_ml && <p className="text-sm text-text-secondary">{resource.title_ml}</p>}
                </div>
                <Badge variant="info">{resource.jurisdiction}</Badge>
              </div>
              <p className="mt-3 text-sm text-text-secondary">{resource.description}</p>
              {resource.description_ml && <p className="mt-2 text-sm text-text-secondary">{resource.description_ml}</p>}
              <div className="mt-4 pt-3 border-t border-divider flex items-center justify-between gap-2">
                <p className="text-xs text-text-secondary">Verified {resource.verified_at} by {resource.reviewer}</p>
                <a href={resource.official_url} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
                  Official source <ExternalLink className="size-3" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
