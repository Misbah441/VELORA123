'use client';

import { useEffect, useState } from 'react';
import { Check, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { createClient } from '@/lib/supabase/client';

interface EnquiryRow {
  id: string;
  message: string;
  sender_name: string;
  sender_contact: string;
  is_read: boolean;
  created_at: string;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unanswered' | 'answered'>('all');

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('enquiries')
      .select('id,message,sender_name,sender_contact,is_read,created_at')
      .order('created_at', { ascending: false });
    setEnquiries((data || []) as unknown as EnquiryRow[]);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function markAnswered(id: string) {
    await createClient().from('enquiries').update({ is_read: true }).eq('id', id);
    await load();
  }

  const filtered = enquiries.filter((row) =>
    filter === 'all'
      ? true
      : filter === 'answered'
        ? row.is_read
        : !row.is_read
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Enquiries</h1>
        <p className="text-text-secondary mt-1">Messages from public visitors.</p>
      </div>
      <div className="flex gap-2">
        {(['all', 'unanswered', 'answered'] as const).map((value) => (
          <button key={value} type="button" onClick={() => setFilter(value)} className="px-3 py-2 rounded-full border border-divider text-sm bg-surface">
            {value}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-sm text-text-secondary">Loading enquiries...</p>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<MessageCircle />} title="No enquiries" description="No enquiries match this filter." />
      ) : (
        <div className="space-y-3">
          {filtered.map((enquiry) => (
            <Card key={enquiry.id}>
              <p className="text-text-main">“{enquiry.message}”</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-text-secondary">
                  <p>{enquiry.sender_name} · {enquiry.sender_contact}</p>
                  <p>{new Date(enquiry.created_at).toLocaleString('en-IN')}</p>
                </div>
                {enquiry.is_read ? (
                  <Badge variant="success"><Check className="size-3" /> Answered</Badge>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => void markAnswered(enquiry.id)}>
                    <Check className="size-4" /> Mark as answered
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
