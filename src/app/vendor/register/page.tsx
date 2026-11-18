'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

interface FieldErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function VendorRegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [language, setLanguage] = useState<'en' | 'ml'>('en');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!fullName.trim()) errors.fullName = 'Full name is required.';
    if (!email.trim()) errors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = 'Enter a valid email address.';
    if (!password) errors.password = 'Password is required.';
    else if (password.length < 8)
      errors.password = 'Password must be at least 8 characters.';
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.';
    else if (password !== confirmPassword)
      errors.confirmPassword = 'Passwords do not match.';
    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setIsLoading(true);
    const supabase = createClient();
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/vendor/onboarding`,
          data: {
            display_name: fullName.trim(),
            preferred_language: language,
          },
        },
      });
      if (signUpError) {
        setError(signUpError.message);
        return;
      }
      setSubmitted(true);
    } catch {
      setError('Unable to register right now. Check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
        <div className="max-w-md w-full bg-surface p-8 rounded-lg shadow-sm border border-divider text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-muted p-3">
              <CheckCircle2 size={32} className="text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-text-main mb-2">Check your email</h1>
          <p className="text-text-secondary mb-6">
            We&apos;ve sent a verification link to{' '}
            <span className="font-medium text-text-main">{email}</span>. Please verify
            your account before signing in.
          </p>
          <Link
            href="/vendor/sign-in"
            className="inline-flex items-center text-sm text-primary font-medium hover:underline"
          >
            ← Back to sign in
          </Link>
        </div>
      </div>
    );
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
          <h1 className="text-2xl font-bold text-text-main">Create your vendor account</h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          {/* Full name */}
          <Input
            id="fullName"
            label="Full name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={fieldErrors.fullName}
          />

          {/* Email */}
          <Input
            id="email"
            label="Email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
          />

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-text-main">
              Password <span className="text-danger ml-1" aria-hidden>*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  'w-full rounded-md border bg-surface px-3 py-2 pr-10 text-base text-text-main',
                  'placeholder:text-text-secondary min-h-[44px]',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                  fieldErrors.password ? 'border-danger focus:ring-danger' : 'border-divider'
                )}
                aria-invalid={fieldErrors.password ? 'true' : undefined}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
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
            {fieldErrors.password && (
              <p id="password-error" className="text-sm text-danger" role="alert">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-text-main">
              Confirm password <span className="text-danger ml-1" aria-hidden>*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={cn(
                  'w-full rounded-md border bg-surface px-3 py-2 pr-10 text-base text-text-main',
                  'placeholder:text-text-secondary min-h-[44px]',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
                  fieldErrors.confirmPassword
                    ? 'border-danger focus:ring-danger'
                    : 'border-divider'
                )}
                aria-invalid={fieldErrors.confirmPassword ? 'true' : undefined}
                aria-describedby={
                  fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined
                }
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p id="confirmPassword-error" className="text-sm text-danger" role="alert">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Language */}
          <fieldset>
            <legend className="text-sm font-medium text-text-main mb-2">
              Preferred language
            </legend>
            <div className="flex gap-3">
              {(['en', 'ml'] as const).map((lang) => (
                <label
                  key={lang}
                  htmlFor={`lang-${lang}`}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer text-sm font-medium transition-colors min-h-[44px]',
                    language === lang
                      ? 'bg-primary text-white border-primary'
                      : 'bg-surface text-text-main border-divider hover:border-primary'
                  )}
                >
                  <input
                    type="radio"
                    id={`lang-${lang}`}
                    name="language"
                    value={lang}
                    checked={language === lang}
                    onChange={() => setLanguage(lang)}
                    className="sr-only"
                  />
                  {lang === 'en' ? 'English' : 'Malayalam'}
                </label>
              ))}
            </div>
          </fieldset>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            className="mt-2"
          >
            Create account
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

        <p className="text-sm text-text-secondary text-center">
          Already have an account?{' '}
          <Link href="/vendor/sign-in" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
