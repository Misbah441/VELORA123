import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'size-4 border-2',
  md: 'size-8 border-2',
  lg: 'size-12 border-4',
};

export function Spinner({ size = 'md', className, label = 'Loading…' }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        'inline-block rounded-full border-current border-t-transparent animate-spin text-primary',
        sizeClasses[size],
        className
      )}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn(
        'animate-pulse rounded-md bg-muted',
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-surface rounded-lg border border-divider p-4 space-y-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
