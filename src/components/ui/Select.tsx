'use client';

import { cn } from '@/lib/utils';
import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  error,
  name,
  id,
  required,
  disabled,
  className,
}: SelectProps) {
  const selectId = id ?? name ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-text-main">
          {label}
          {required && (
            <span className="text-danger ml-1" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        required={required}
        disabled={disabled}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? `${selectId}-error` : undefined}
        className={cn(
          'w-full rounded-md border border-divider bg-surface px-3 py-2 text-base text-text-main',
          'min-h-[44px]',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-danger focus:ring-danger',
          className
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${selectId}-error`} className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
