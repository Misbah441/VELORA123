import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 px-4 text-center',
        className
      )}
    >
      <div className="size-12 rounded-full bg-red-100 flex items-center justify-center">
        <svg
          className="size-6 text-danger"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z"
          />
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-danger">{title}</h3>
        <p className="text-text-secondary max-w-sm">{description}</p>
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
