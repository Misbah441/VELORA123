'use client';

import { useState } from 'react';
import { Bell, Check, ArrowRight, Package, Store, ShoppingCart, MessageCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  relativeTime: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  icon: 'reservation' | 'surplus' | 'shop' | 'enquiry' | 'welcome';
}

const iconMap: Record<Notification['icon'], React.ReactNode> = {
  reservation: <ShoppingCart className="size-5" />,
  surplus: <Package className="size-5" />,
  shop: <Store className="size-5" />,
  enquiry: <MessageCircle className="size-5" />,
  welcome: <Sparkles className="size-5" />,
};

const initialNotifications: Notification[] = [
  {
    id: 'n1',
    title: 'New reservation: Priya requested 2 kg of Tomatoes',
    relativeTime: '30 min ago',
    read: false,
    actionUrl: '/vendor/reservations',
    actionLabel: 'View reservations',
    icon: 'reservation',
  },
  {
    id: 'n2',
    title: 'Surplus listing expiring soon: Raw banana closes in 1 hour',
    relativeTime: '1 hour ago',
    read: false,
    actionUrl: '/vendor/surplus',
    actionLabel: 'Manage surplus',
    icon: 'surplus',
  },
  {
    id: 'n3',
    title: "Reservation confirmed: Suresh's Tomato 1 kg — collect by 6 PM",
    relativeTime: '3 hours ago',
    read: true,
    icon: 'reservation',
  },
  {
    id: 'n4',
    title: 'New enquiry from anonymous visitor',
    relativeTime: 'Yesterday',
    read: true,
    actionUrl: '/vendor/enquiries',
    actionLabel: 'View enquiries',
    icon: 'enquiry',
  },
  {
    id: 'n5',
    title: 'Shop published successfully',
    relativeTime: '2 days ago',
    read: true,
    actionUrl: '/vendor/shop',
    actionLabel: 'View shop',
    icon: 'shop',
  },
  {
    id: 'n6',
    title: 'Welcome to VendorSpace! Complete your shop setup.',
    relativeTime: '3 days ago',
    read: true,
    actionUrl: '/vendor/onboarding',
    actionLabel: 'Go to setup',
    icon: 'welcome',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markOneRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-text-secondary mt-1 text-sm">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            <Check className="size-4" /> Mark all as read
          </Button>
        )}
      </div>

      {/* Notifications list */}
      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell />}
          title="All caught up"
          description="No notifications to show right now."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                'flex gap-3 rounded-lg border p-4 transition-colors',
                notif.read
                  ? 'bg-surface border-divider'
                  : 'bg-accent-surface border-l-4 border-l-accent-text border-divider'
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  'flex-shrink-0 size-9 rounded-full flex items-center justify-center',
                  notif.read ? 'bg-muted text-text-secondary' : 'bg-primary/10 text-primary'
                )}
              >
                {iconMap[notif.icon]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'text-sm',
                    notif.read ? 'text-text-secondary' : 'font-medium text-text-main'
                  )}
                >
                  {notif.title}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <span className="text-xs text-text-secondary">{notif.relativeTime}</span>
                  {notif.actionUrl && (
                    <Link
                      href={notif.actionUrl}
                      onClick={() => markOneRead(notif.id)}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      {notif.actionLabel ?? 'View'}
                      <ArrowRight className="size-3" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Unread dot */}
              {!notif.read && (
                <div className="flex-shrink-0 mt-1">
                  <span className="size-2 rounded-full bg-primary block" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
