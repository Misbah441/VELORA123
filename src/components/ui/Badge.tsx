import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'muted' | 'outline';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-muted text-text-main',
  success: 'bg-green-100 text-primary',
  warning: 'bg-accent-surface text-accent-text',
  danger: 'bg-red-100 text-danger',
  info: 'bg-blue-100 text-information',
  muted: 'bg-divider text-text-secondary',
  outline: 'bg-transparent border border-divider text-text-secondary',
};

export function Badge({
  variant = 'default',
  children,
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
