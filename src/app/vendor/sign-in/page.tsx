'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function VendorSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setIsLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const next = new URLSearchParams(window.location.search).get('next');
    router.replace(next?.startsWith('/vendor') ? next : '/vendor');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-md w-full bg-surface p-8 rounded-lg shadow-sm border border-divider">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center text-sm text-text-secondary hover:text-primary transition-colors mb-6"
        >
          ← Back to marketplace
        </Link>

        {/* Brand */}
        <div className="mb-6">
          <p className="text-primary font-bold text-lg mb-1">🌿 VendorSpace</p>
          <h1 className="text-2xl font-bold text-text-main">Vendor sign in</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            id="email"
            label="Email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-text-main">
              Password <span className="text-danger ml-1" aria-hidden>*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  'w-full rounded-md border border-divider bg-surface px-3 py-2 pr-10 text-base text-text-main',
                  'placeholder:text-text-secondary min-h-[44px]',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary'
                )}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end mt-1">
              <Link
                href="/vendor/reset-password"
                className="text-xs text-text-secondary hover:text-primary transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            className="mt-2"
          >
            Sign in
          </Button>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 text-sm text-danger" role="alert">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Divider */}
        <div className="my-6 border-t border-divider" />

        {/* Register link */}
        <p className="text-sm text-text-secondary text-center">
          New vendor?{' '}
          <Link
            href="/vendor/register"
            className="text-primary font-medium hover:underline"
          >
            Register your shop →
          </Link>
        </p>
      </div>
    </div>
  );
}
