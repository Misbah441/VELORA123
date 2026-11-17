'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

type Language = 'en' | 'ml';
type StallType = 'fixed' | 'mobile';
type ContactType = 'none' | 'phone' | 'whatsapp';
type ShopType = 'Produce' | 'Food Stall' | 'Grocery' | 'Clothing' | 'Household' | 'Other';
type Unit = 'kg' | 'piece' | 'bunch' | 'plate' | 'litre' | 'other';

interface HourRow {
  closed: boolean;
  open: string;
  close: string;
}

interface Product {
  id: string;
  name: string;
  unit: Unit | '';
  price: string;
  available: boolean;
}

interface FormData {
  // Step 1
  displayName: string;
  language: Language;
  // Step 2
  shopName: string;
  shopType: ShopType | '';
  description: string;
  stallType: StallType;
  // Step 3
  locality: string;
  address: string;
  contactType: ContactType;
  contactValue: string;
  hours: Record<string, HourRow>;
  // Step 4
  products: Product[];
  // Step 5
  paymentCash: boolean;
  paymentUpi: boolean;
  openingBalance: string;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const STEP_LABELS = ['Account', 'Shop', 'Location', 'Items', 'Preferences', 'Preview'];

function defaultHours(): Record<string, HourRow> {
  const h: Record<string, HourRow> = {};
  DAYS.forEach((d) => { h[d] = { closed: false, open: '08:00', close: '20:00' }; });
  return h;
}

const initialForm: FormData = {
  displayName: '',
  language: 'en',
  shopName: '',
  shopType: '',
  description: '',
  stallType: 'fixed',
  locality: '',
  address: '',
  contactType: 'none',
  contactValue: '',
  hours: defaultHours(),
  products: [],
  paymentCash: true,
  paymentUpi: false,
  openingBalance: '',
};

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <nav aria-label="Onboarding steps" className="flex items-center justify-center gap-0 mb-8 overflow-x-auto">
      {STEP_LABELS.map((label, idx) => {
        const step = idx + 1;
        const done = current > step;
        const active = current === step;
        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
                  done && 'bg-primary text-white',
                  active && 'bg-primary text-white ring-4 ring-muted',
                  !done && !active && 'bg-muted text-text-secondary'
                )}
                aria-current={active ? 'step' : undefined}
              >
                {done ? <Check size={16} /> : step}
              </div>
              <span
                className={cn(
                  'text-xs font-medium hidden sm:block',
                  active ? 'text-primary' : 'text-text-secondary'
                )}
              >
                {label}
              </span>
            </div>
            {idx < STEP_LABELS.length - 1 && (
              <div
                className={cn(
                  'w-8 sm:w-12 h-0.5 mx-1 mb-4',
                  current > step + 1 || done ? 'bg-primary' : 'bg-divider'
                )}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}

// ─── Step 1: Account ─────────────────────────────────────────────────────────

function Step1({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-text-main">Account details</h2>
      <Input
        id="displayName"
        label="Display name"
        required
        placeholder="e.g. Rajan's Fresh Produce"
        value={form.displayName}
        onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
      />
      <fieldset>
        <legend className="text-sm font-medium text-text-main mb-2">Preferred language</legend>
        <div className="flex gap-3">
          {(['en', 'ml'] as Language[]).map((lang) => (
            <label
              key={lang}
              htmlFor={`lang-${lang}`}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer text-sm font-medium transition-colors min-h-[44px]',
                form.language === lang
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface text-text-main border-divider hover:border-primary'
              )}
            >
              <input
                type="radio"
                id={`lang-${lang}`}
                name="language"
                value={lang}
                checked={form.language === lang}
                onChange={() => setForm((f) => ({ ...f, language: lang }))}
                className="sr-only"
              />
              {lang === 'en' ? 'English' : 'Malayalam'}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

// ─── Step 2: Shop identity ────────────────────────────────────────────────────

function Step2({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  const descLength = form.description.length;
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-text-main">Shop identity</h2>
      <Input
        id="shopName"
        label="Shop name"
        required
        placeholder="e.g. Fresh Greens Corner"
        value={form.shopName}
        onChange={(e) => setForm((f) => ({ ...f, shopName: e.target.value }))}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="shopType" className="text-sm font-medium text-text-main">
          Shop type <span className="text-danger ml-1" aria-hidden>*</span>
        </label>
        <select
          id="shopType"
          value={form.shopType}
          onChange={(e) => setForm((f) => ({ ...f, shopType: e.target.value as ShopType }))}
          className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-base text-text-main min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        >
          <option value="">Select shop type…</option>
          {['Produce', 'Food Stall', 'Grocery', 'Clothing', 'Household', 'Other'].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-text-main">
          Description <span className="text-text-secondary font-normal">(optional)</span>
        </label>
        <textarea
          id="description"
          rows={3}
          maxLength={300}
          placeholder="Tell customers what makes your shop special…"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-base text-text-main placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
        />
        <p className="text-xs text-text-secondary text-right">{descLength}/300</p>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-text-main mb-2">Stall type</legend>
        <div className="flex gap-3">
          {(['fixed', 'mobile'] as StallType[]).map((s) => (
            <label
              key={s}
              htmlFor={`stall-${s}`}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer text-sm font-medium transition-colors min-h-[44px]',
                form.stallType === s
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface text-text-main border-divider hover:border-primary'
              )}
            >
              <input
                type="radio"
                id={`stall-${s}`}
                name="stallType"
                value={s}
                checked={form.stallType === s}
                onChange={() => setForm((f) => ({ ...f, stallType: s }))}
                className="sr-only"
              />
              {s === 'fixed' ? 'Fixed location' : 'Mobile vendor'}
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

// ─── Step 3: Location & contact ───────────────────────────────────────────────

function Step3({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  function setHour(day: string, field: keyof HourRow, value: string | boolean) {
    setForm((f) => ({
      ...f,
      hours: { ...f.hours, [day]: { ...f.hours[day], [field]: value } },
    }));
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-text-main">Location &amp; contact</h2>

      <Input
        id="locality"
        label="Locality"
        required
        placeholder="e.g. Kaloor, Ernakulam"
        value={form.locality}
        onChange={(e) => setForm((f) => ({ ...f, locality: e.target.value }))}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="address" className="text-sm font-medium text-text-main">
          Address <span className="text-text-secondary font-normal">(optional)</span>
        </label>
        <textarea
          id="address"
          rows={2}
          placeholder="Full address or landmark"
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-base text-text-main placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
        />
      </div>

      {/* Public contact */}
      <fieldset>
        <legend className="text-sm font-medium text-text-main mb-2">Public contact</legend>
        <div className="flex gap-3 mb-3">
          {(['none', 'phone', 'whatsapp'] as ContactType[]).map((c) => (
            <label
              key={c}
              htmlFor={`contact-${c}`}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer text-sm font-medium transition-colors min-h-[44px]',
                form.contactType === c
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface text-text-main border-divider hover:border-primary'
              )}
            >
              <input
                type="radio"
                id={`contact-${c}`}
                name="contactType"
                value={c}
                checked={form.contactType === c}
                onChange={() => setForm((f) => ({ ...f, contactType: c, contactValue: '' }))}
                className="sr-only"
              />
              {c === 'none' ? 'None' : c === 'phone' ? 'Phone' : 'WhatsApp'}
            </label>
          ))}
        </div>
        {form.contactType !== 'none' && (
          <Input
            id="contactValue"
            label={form.contactType === 'phone' ? 'Phone number' : 'WhatsApp number'}
            type="tel"
            placeholder="+91 98765 43210"
            value={form.contactValue}
            onChange={(e) => setForm((f) => ({ ...f, contactValue: e.target.value }))}
          />
        )}
      </fieldset>

      {/* Opening hours */}
      <div>
        <p className="text-sm font-medium text-text-main mb-2">Opening hours</p>
        <div className="rounded-md border border-divider overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-text-secondary w-16">Day</th>
                <th className="text-left px-3 py-2 font-medium text-text-secondary">Open</th>
                <th className="text-left px-3 py-2 font-medium text-text-secondary">Close</th>
                <th className="text-center px-3 py-2 font-medium text-text-secondary">Closed</th>
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, idx) => {
                const row = form.hours[day];
                return (
                  <tr key={day} className={cn('border-t border-divider', idx % 2 === 0 ? 'bg-surface' : 'bg-background')}>
                    <td className="px-3 py-2 font-medium text-text-main">{day}</td>
                    <td className="px-3 py-2">
                      <input
                        type="time"
                        id={`open-${day}`}
                        aria-label={`${day} opening time`}
                        value={row.open}
                        disabled={row.closed}
                        onChange={(e) => setHour(day, 'open', e.target.value)}
                        className="rounded border border-divider bg-surface px-2 py-1 text-sm text-text-main min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="time"
                        id={`close-${day}`}
                        aria-label={`${day} closing time`}
                        value={row.close}
                        disabled={row.closed}
                        onChange={(e) => setHour(day, 'close', e.target.value)}
                        className="rounded border border-divider bg-surface px-2 py-1 text-sm text-text-main min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-40 disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        id={`closed-${day}`}
                        aria-label={`${day} closed`}
                        checked={row.closed}
                        onChange={(e) => setHour(day, 'closed', e.target.checked)}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Items sold ───────────────────────────────────────────────────────

function Step4({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  const [newName, setNewName] = useState('');
  const [newUnit, setNewUnit] = useState<Unit | ''>('');
  const [newPrice, setNewPrice] = useState('');
  const [newAvail, setNewAvail] = useState(true);
  const [addError, setAddError] = useState('');

  function addProduct() {
    setAddError('');
    if (!newName.trim()) { setAddError('Product name is required.'); return; }
    if (!newUnit) { setAddError('Unit is required.'); return; }
    const price = parseFloat(newPrice);
    if (!newPrice || isNaN(price) || price <= 0) { setAddError('Enter a valid price greater than 0.'); return; }

    const product: Product = {
      id: Date.now().toString(),
      name: newName.trim(),
      unit: newUnit,
      price: newPrice,
      available: newAvail,
    };
    setForm((f) => ({ ...f, products: [...f.products, product] }));
    setNewName(''); setNewUnit(''); setNewPrice(''); setNewAvail(true);
  }

  function removeProduct(id: string) {
    setForm((f) => ({ ...f, products: f.products.filter((p) => p.id !== id) }));
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-text-main">Items sold</h2>

      {/* Product list */}
      {form.products.length > 0 && (
        <ul className="flex flex-col gap-2">
          {form.products.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-md border border-divider bg-surface"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-main truncate">{p.name}</p>
                <p className="text-xs text-text-secondary">
                  {p.unit} · ₹{p.price} ·{' '}
                  <span className={p.available ? 'text-primary' : 'text-text-secondary'}>
                    {p.available ? 'Available' : 'Unavailable'}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeProduct(p.id)}
                className="text-xs text-danger hover:underline flex-shrink-0"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {form.products.length === 0 && (
        <p className="text-sm text-text-secondary italic">No products added yet. Add at least one to continue.</p>
      )}

      {/* Add product form */}
      <div className="rounded-md border border-divider bg-muted p-4 flex flex-col gap-3">
        <p className="text-sm font-semibold text-text-main">Add a product</p>
        <Input
          id="productName"
          label="Product name"
          required
          placeholder="e.g. Tomatoes"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="productUnit" className="text-sm font-medium text-text-main">
              Unit <span className="text-danger ml-1" aria-hidden>*</span>
            </label>
            <select
              id="productUnit"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value as Unit)}
              className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-base text-text-main min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Unit…</option>
              {(['kg', 'piece', 'bunch', 'plate', 'litre', 'other'] as Unit[]).map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="productPrice" className="text-sm font-medium text-text-main">
              Price (₹) <span className="text-danger ml-1" aria-hidden>*</span>
            </label>
            <input
              id="productPrice"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-base text-text-main min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        <label htmlFor="productAvail" className="flex items-center gap-2 cursor-pointer text-sm text-text-main">
          <input
            type="checkbox"
            id="productAvail"
            checked={newAvail}
            onChange={(e) => setNewAvail(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          Available now
        </label>

        {addError && (
          <div className="flex items-start gap-2 text-sm text-danger" role="alert">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>{addError}</span>
          </div>
        )}

        <Button type="button" variant="secondary" onClick={addProduct}>
          Add product
        </Button>
      </div>
    </div>
  );
}

// ─── Step 5: Business preferences ────────────────────────────────────────────

function Step5({ form, setForm }: { form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>> }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-text-main">Business preferences</h2>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-text-main">Currency</p>
        <div className="rounded-md border border-divider bg-muted px-3 py-2 text-base text-text-secondary min-h-[44px] flex items-center">
          INR — Indian Rupee (₹)
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-text-main mb-2">
          Payment methods <span className="text-danger ml-1" aria-hidden>*</span>
        </legend>
        <div className="flex flex-col gap-2">
          <label htmlFor="paymentCash" className="flex items-center gap-2 cursor-pointer text-sm text-text-main">
            <input
              type="checkbox"
              id="paymentCash"
              checked={form.paymentCash}
              onChange={(e) => setForm((f) => ({ ...f, paymentCash: e.target.checked }))}
              className="w-4 h-4 accent-primary"
            />
            Cash
          </label>
          <label htmlFor="paymentUpi" className="flex items-center gap-2 cursor-pointer text-sm text-text-main">
            <input
              type="checkbox"
              id="paymentUpi"
              checked={form.paymentUpi}
              onChange={(e) => setForm((f) => ({ ...f, paymentUpi: e.target.checked }))}
              className="w-4 h-4 accent-primary"
            />
            UPI
          </label>
        </div>
        {!form.paymentCash && !form.paymentUpi && (
          <p className="text-xs text-danger mt-1">Select at least one payment method.</p>
        )}
      </fieldset>

      <div className="flex flex-col gap-1">
        <label htmlFor="openingBalance" className="text-sm font-medium text-text-main">
          Opening cash balance (₹) <span className="text-text-secondary font-normal">(optional)</span>
        </label>
        <input
          id="openingBalance"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={form.openingBalance}
          onChange={(e) => setForm((f) => ({ ...f, openingBalance: e.target.value }))}
          className="w-full rounded-md border border-divider bg-surface px-3 py-2 text-base text-text-main min-h-[44px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>
    </div>
  );
}

// ─── Step 6: Preview ──────────────────────────────────────────────────────────

function Step6({
  form,
  onPublish,
  isPublishing,
  published,
}: {
  form: FormData;
  onPublish: () => void;
  isPublishing: boolean;
  published: boolean;
}) {
  const openDays = DAYS.filter((d) => !form.hours[d].closed);
  const hoursSummary =
    openDays.length === 0
      ? 'Closed all days'
      : openDays.length === 7
      ? `Mon–Sun ${form.hours['Mon'].open}–${form.hours['Mon'].close}`
      : openDays.map((d) => `${d} ${form.hours[d].open}–${form.hours[d].close}`).join(', ');

  if (published) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="rounded-full bg-muted p-4">
          <CheckCircle2 size={40} className="text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-text-main">Your shop is live!</h2>
        <p className="text-text-secondary">Redirecting to dashboard…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-text-main">Preview &amp; publish</h2>
      <p className="text-sm text-text-secondary">Here&apos;s what customers will see:</p>

      {/* Shop preview card */}
      <div className="rounded-lg border border-divider bg-surface p-5 flex flex-col gap-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-bold text-text-main">{form.shopName || '—'}</h3>
            {form.shopType && (
              <span className="text-xs font-medium bg-muted text-primary px-2 py-1 rounded-full whitespace-nowrap">
                {form.shopType}
              </span>
            )}
          </div>
          {form.description && (
            <p className="text-sm text-text-secondary mt-1">{form.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-0.5">Locality</p>
            <p className="text-text-main">{form.locality || '—'}</p>
          </div>
          {form.contactType !== 'none' && form.contactValue && (
            <div>
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-0.5">
                {form.contactType === 'phone' ? 'Phone' : 'WhatsApp'}
              </p>
              <p className="text-text-main">{form.contactValue}</p>
            </div>
          )}
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-0.5">Hours</p>
            <p className="text-text-main text-xs">{hoursSummary}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-0.5">Payment</p>
            <p className="text-text-main">
              {[form.paymentCash && 'Cash', form.paymentUpi && 'UPI'].filter(Boolean).join(' · ') || '—'}
            </p>
          </div>
        </div>

        {form.products.length > 0 && (
          <div>
            <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-2">Products</p>
            <ul className="flex flex-col gap-1">
              {form.products.map((p) => (
                <li key={p.id} className="flex justify-between text-sm">
                  <span className="text-text-main">{p.name} <span className="text-text-secondary">({p.unit})</span></span>
                  <span className="text-text-main font-medium">₹{p.price}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="primary"
          isLoading={isPublishing}
          onClick={onPublish}
          className="sm:flex-1"
        >
          Publish shop
        </Button>
        <Button type="button" variant="ghost" className="sm:flex-1">
          Save as draft
        </Button>
      </div>
    </div>
  );
}

// ─── Validation per step ──────────────────────────────────────────────────────

function isStepValid(step: number, form: FormData): boolean {
  switch (step) {
    case 1:
      return form.displayName.trim().length > 0;
    case 2:
      return form.shopName.trim().length > 0 && form.shopType !== '';
    case 3:
      return form.locality.trim().length > 0;
    case 4:
      return form.products.length > 0;
    case 5:
      return form.paymentCash || form.paymentUpi;
    case 6:
      return true;
    default:
      return true;
  }
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialForm);
  const [isPublishing, setIsPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  async function handlePublish() {
    setIsPublishing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsPublishing(false);
    setPublished(true);
  }

  const canNext = isStepValid(currentStep, form);

  function renderStep() {
    switch (currentStep) {
      case 1: return <Step1 form={form} setForm={setForm} />;
      case 2: return <Step2 form={form} setForm={setForm} />;
      case 3: return <Step3 form={form} setForm={setForm} />;
      case 4: return <Step4 form={form} setForm={setForm} />;
      case 5: return <Step5 form={form} setForm={setForm} />;
      case 6: return <Step6 form={form} onPublish={handlePublish} isPublishing={isPublishing} published={published} />;
      default: return null;
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      {/* Header */}
      <div className="max-w-2xl mx-auto flex items-center justify-between mb-6">
        <p className="text-primary font-bold text-lg">🌿 VendorSpace</p>
        <Link
          href="/vendor"
          className="text-sm text-text-secondary hover:text-primary transition-colors"
        >
          Save and exit
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <StepIndicator current={currentStep} />

        {/* Step content */}
        <div className="bg-surface rounded-lg border border-divider p-6 sm:p-8 mb-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        {!published && (
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              disabled={currentStep === 1}
            >
              <ChevronLeft size={16} />
              Back
            </Button>

            {currentStep < 6 ? (
              <Button
                type="button"
                variant="primary"
                disabled={!canNext}
                onClick={() => setCurrentStep((s) => Math.min(6, s + 1))}
              >
                Next
                <ChevronRight size={16} />
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
