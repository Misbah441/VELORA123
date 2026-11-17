import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
}

export function Card({ children, padded = true, className, ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        'bg-surface rounded-lg border border-divider shadow-sm',
        padded && 'p-4',
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn('border-b border-divider pb-3 mb-4', className)}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      {...props}
      className={cn('text-lg font-semibold text-text-main', className)}
    >
      {children}
    </h3>
  );
}

export function CardContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} className={cn(className)}>
      {children}
    </div>
  );
}
