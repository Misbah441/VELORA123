'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [language, setLanguage] = useState<'en' | 'ml'>('en');
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      setDisplayName(String(user?.user_metadata?.display_name || ''));
      setLanguage(user?.user_metadata?.preferred_language === 'ml' ? 'ml' : 'en');
    });
  }, []);

  async function saveAccount() {
    setSaving(true);
    setMessage('');
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName.trim(), preferred_language: language },
    });
    if (!error) {
      await supabase
        .from('vendor_profiles')
        .update({ display_name: displayName.trim(), preferred_language: language })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);
      setMessage('Account settings saved.');
    } else {
      setMessage(error.message);
    }
    setSaving(false);
  }

  async function signOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/vendor/sign-in');
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-text-main mb-6">Settings</h1>

      {/* Account */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-text-main mb-4">Account</h2>
        <Card className="space-y-4">
          <Input
            label="Display name"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            placeholder="Your name"
          />
          <div>
            <label className="text-sm font-medium text-text-main block mb-1">
              Preferred language
            </label>
            <select
              value={language}
              onChange={(event) => setLanguage(event.target.value as 'en' | 'ml')}
              className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px]"
            >
              <option value="en">English</option>
              <option value="ml">മലയാളം (Malayalam)</option>
            </select>
          </div>
          <div className="flex justify-end">
            <Button onClick={saveAccount} isLoading={saving} disabled={!displayName.trim()}>
              Save changes
            </Button>
          </div>
          {message && <p className="text-sm text-text-secondary" role="status">{message}</p>}
        </Card>
      </section>

      {/* Notifications */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-text-main mb-4">
          Notification preferences
        </h2>
        <Card className="space-y-4">
          {[
            'New reservation request',
            'Reservation confirmed',
            'New enquiry',
            'BuyTogether updates',
          ].map((pref) => (
            <label
              key={pref}
              className="flex items-center justify-between cursor-pointer min-h-[44px]"
            >
              <span className="text-sm text-text-main">{pref}</span>
              <input type="checkbox" className="accent-primary size-4" defaultChecked />
            </label>
          ))}
        </Card>
      </section>

      {/* Danger zone */}
      <section>
        <h2 className="text-lg font-semibold text-danger mb-4">Danger zone</h2>
        <Card className="border-danger/30 space-y-4">
          <div>
            <p className="text-sm font-medium text-text-main">Sign out</p>
            <p className="text-xs text-text-secondary mt-0.5">
              Sign out of your account on this device.
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={signOut} isLoading={signingOut}>Sign out</Button>
          <div className="pt-4 border-t border-divider">
            <p className="text-sm font-medium text-text-main">Delete account</p>
            <p className="text-xs text-text-secondary mt-0.5">
              Permanently delete your account and all data. This cannot be
              undone.
            </p>
            <Button variant="danger" size="sm" className="mt-3">
              Delete my account
            </Button>
          </div>
        </Card>
      </section>
    </div>
  );
}
