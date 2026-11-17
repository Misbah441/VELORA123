'use client';

import { useState } from 'react';
import { Check, MessageCircle, Phone, Mail, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

type EnquiryStatus = 'Unanswered' | 'Answered';
type TabFilter = 'All' | 'Unanswered' | 'Answered';

interface Enquiry {
  id: string;
  message: string;
  senderName: string | null;
  senderContact: { type: 'phone' | 'email'; masked: string } | null;
  relativeTime: string;
  status: EnquiryStatus;
}

const demoEnquiries: Enquiry[] = [
  {
    id: 'e1',
    message: 'Do you have organic tomatoes? What is the price per kg?',
    senderName: 'Priya',
    senderContact: { type: 'phone', masked: '+91 98XXX XXXXX' },
    relativeTime: '2 hours ago',
    status: 'Unanswered',
  },
  {
    id: 'e2',
    message: 'What time do you open on Sundays?',
    senderName: null,
    senderContact: null,
    relativeTime: 'Yesterday',
    status: 'Answered',
  },
  {
    id: 'e3',
    message: 'Can I reserve 5 kg of bananas for tomorrow morning?',
    senderName: 'Suresh',
    senderContact: { type: 'email', masked: 'sur***@gmail.com' },
    relativeTime: '3 hours ago',
    status: 'Unanswered',
  },
  {
    id: 'e4',
    message: 'Do you sell curry leaves?',
    senderName: null,
    senderContact: null,
    relativeTime: '2 days ago',
    status: 'Answered',
  },
];

const tabs: TabFilter[] = ['All', 'Unanswered', 'Answered'];

export default function EnquiriesPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>('All');
  const [enquiries, setEnquiries] = useState<Enquiry[]>(demoEnquiries);

  function markAnswered(id: string) {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Answered' } : e))
    );
  }

  const filtered = enquiries.filter((e) => {
    if (activeTab === 'All') return true;
    return e.status === activeTab;
  });

  const unansweredCount = enquiries.filter((e) => e.status === 'Unanswered').length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-main">Enquiries</h1>
        <p className="text-text-secondary mt-1">Messages from visitors about your shop or products</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
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
            {tab === 'Unanswered' && unansweredCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center size-4 rounded-full bg-danger text-white text-xs">
                {unansweredCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Enquiries list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<MessageCircle />}
            title="No enquiries"
            description="No enquiries match this filter."
          />
        ) : (
          filtered.map((enq) => (
            <Card
              key={enq.id}
              className={cn(
                'transition-opacity',
                enq.status === 'Answered' && 'opacity-70'
              )}
            >
              <div className="flex flex-col gap-3">
                {/* Message */}
                <p className="text-text-main">
                  &ldquo;{enq.message}&rdquo;
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-3 text-xs text-text-secondary">
                    {/* Sender */}
                    <span className="flex items-center gap-1">
                      <User className="size-3" />
                      {enq.senderName ?? 'Anonymous'}
                    </span>
                    {/* Contact */}
                    {enq.senderContact && (
                      <span className="flex items-center gap-1">
                        {enq.senderContact.type === 'phone' ? (
                          <Phone className="size-3" />
                        ) : (
                          <Mail className="size-3" />
                        )}
                        {enq.senderContact.masked}
                      </span>
                    )}
                    {/* Time */}
                    <span className="text-text-secondary">{enq.relativeTime}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {enq.status === 'Answered' ? (
                      <Badge variant="success">
                        <Check className="size-3" /> Answered
                      </Badge>
                    ) : (
                      <>
                        <Badge variant="warning">Unanswered</Badge>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => markAnswered(enq.id)}
                        >
                          <Check className="size-4" /> Mark as answered
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Footer note */}
      <div className="bg-muted rounded-lg p-4 text-sm text-text-secondary">
        <span className="font-medium text-text-main">Note: </span>
        Reply directly to the customer&rsquo;s contact. Enquiries are for information only —
        use <a href="/vendor/reservations" className="text-primary underline">Reservations</a> for stock holds.
      </div>
    </div>
  );
}
