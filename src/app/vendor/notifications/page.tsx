'use client';

import { useEffect, useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { createClient } from '@/lib/supabase/client';

interface NotificationRow {
  id: string;
  event_type: string;
  title: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('notifications')
      .select('id,event_type,title,body,is_read,created_at')
      .order('created_at', { ascending: false });
    setNotifications((data || []) as unknown as NotificationRow[]);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function markRead(id: string) {
    await createClient().from('notifications').update({ is_read: true }).eq('id', id);
    await load();
  }

  async function markAllRead() {
    await createClient().from('notifications').update({ is_read: true }).eq('is_read', false);
    await load();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-text-secondary mt-1">Reservation and account updates.</p>
        </div>
        {notifications.some((item) => !item.is_read) && (
          <Button size="sm" variant="secondary" onClick={() => void markAllRead()}>
            <Check className="size-4" /> Mark all read
          </Button>
        )}
      </div>
      {loading ? (
        <p className="text-sm text-text-secondary">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <EmptyState icon={<Bell />} title="No notifications" description="Updates will appear here." />
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} className={notification.is_read ? 'opacity-70' : ''}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{notification.title}</p>
                  {notification.body && <p className="text-sm text-text-secondary mt-1">{notification.body}</p>}
                  <p className="text-xs text-text-secondary mt-2">{new Date(notification.created_at).toLocaleString('en-IN')}</p>
                </div>
                {notification.is_read ? (
                  <Badge variant="success">Read</Badge>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => void markRead(notification.id)}>Mark read</Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
