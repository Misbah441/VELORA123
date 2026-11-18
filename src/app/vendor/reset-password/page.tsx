'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const isNewPassword = searchParams.get('step') === 'new-password';

  // Step 1 state
  const [email, setEmail] = useState('');
  const [step1Loading, setStep1Loading] = useState(false);
  const [step1Success, setStep1Success] = useState(false);
  const [step1Error, setStep1Error] = useState('');

  // Step 2 state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step2Loading, setStep2Loading] = useState(false);
  const [step2Success, setStep2Success] = useState(false);
  const [step2Error, setStep2Error] = useState('');

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    setStep1Error('');
    if (!email.trim()) {
      setStep1Error('Please enter your email address.');
      return;
    }
    setStep1Loading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/vendor/reset-password%3Fstep=new-password`,
      });
      if (error) throw error;
      setStep1Success(true);
    } catch (error) {
      setStep1Error(error instanceof Error ? error.message : 'Unable to send reset email.');
    } finally {
      setStep1Loading(false);
    }
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    setStep2Error('');
    if (!newPassword) {
      setStep2Error('Please enter a new password.');
      return;
    }
    if (newPassword.length < 8) {
      setStep2Error('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setStep2Error('Passwords do not match.');
      return;
    }
    setStep2Loading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setStep2Success(true);
    } catch (error) {
      setStep2Error(error instanceof Error ? error.message : 'Unable to update password.');
    } finally {
      setStep2Loading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="max-w-sm w-full bg-surface p-8 rounded-lg shadow-sm border border-divider">
        {/* Back link */}
        <Link
          href="/vendor/sign-in"
          className="inline-flex items-center text-sm text-text-secondary hover:text-primary transition-colors mb-6"
        >
          ← Back to sign in
        </Link>

        {/* Brand */}
        <div className="mb-6">
          <p className="text-primary font-bold text-lg mb-1">🌿 VendorSpace</p>
          <h1 className="text-2xl font-bold text-text-main">Reset your password</h1>
        </div>

        {/* ---- Step 1: Request reset link ---- */}
        {!isNewPassword && (
          <>
            {step1Success ? (
              <div className="flex flex-col items-center gap-3 text-center py-4">
                <CheckCircle2 size={36} className="text-primary" />
                <p className="text-text-main text-sm leading-relaxed">
                  If that email is registered, we&apos;ve sent a reset link. Check your
                  inbox.
                </p>
                <Link
                  href="/vendor/sign-in"
                  className="mt-2 text-sm text-primary font-medium hover:underline"
                >
                  ← Back to sign in
                </Link>
              </div>
            ) : (
              <form onSubmit={handleStep1} className="flex flex-col gap-4" noValidate>
                <Input
                  id="reset-email"
                  label="Email address"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={step1Error}
                />
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={step1Loading}
                >
                  Send reset link
                </Button>
                {step1Error && !step1Error.includes('email') && (
                  <div className="flex items-start gap-2 text-sm text-danger" role="alert">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{step1Error}</span>
                  </div>
                )}
              </form>
            )}
          </>
        )}

        {/* ---- Step 2: Set new password ---- */}
        {isNewPassword && (
          <>
            {step2Success ? (
              <div className="flex flex-col items-center gap-3 text-center py-4">
                <CheckCircle2 size={36} className="text-primary" />
                <p className="text-text-main text-sm leading-relaxed">
                  Password updated — you can now sign in.
                </p>
                <Link
                  href="/vendor/sign-in"
                  className="mt-2 text-sm text-primary font-medium hover:underline"
                >
                  ← Back to sign in
                </Link>
              </div>
            ) : (
              <form onSubmit={handleStep2} className="flex flex-col gap-4" noValidate>
                {/* New password */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="new-password"
                    className="text-sm font-medium text-text-main"
                  >
                    New password <span className="text-danger ml-1" aria-hidden>*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNew ? 'text' : 'password'}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="Min. 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={cn(
                        'w-full rounded-md border bg-surface px-3 py-2 pr-10 text-base text-text-main',
                        'placeholder:text-text-secondary min-h-[44px]',
                        'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                        'border-divider'
                      )}
                    />
                    <button
                      type="button"
                      aria-label={showNew ? 'Hide password' : 'Show password'}
                      onClick={() => setShowNew((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main transition-colors"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="confirm-new-password"
                    className="text-sm font-medium text-text-main"
                  >
                    Confirm password <span className="text-danger ml-1" aria-hidden>*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-new-password"
                      type={showConfirm ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={cn(
                        'w-full rounded-md border bg-surface px-3 py-2 pr-10 text-base text-text-main',
                        'placeholder:text-text-secondary min-h-[44px]',
                        'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                        'border-divider'
                      )}
                    />
                    <button
                      type="button"
                      aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main transition-colors"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {step2Error && (
                  <div className="flex items-start gap-2 text-sm text-danger" role="alert">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{step2Error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={step2Loading}
                >
                  Set new password
                </Button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
