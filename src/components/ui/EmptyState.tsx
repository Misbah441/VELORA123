import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 py-16 px-4 text-center',
        className
      )}
    >
      {icon && (
        <div className="text-text-secondary opacity-50 text-5xl">{icon}</div>
      )}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-text-main">{title}</h3>
        {description && (
          <p className="text-text-secondary max-w-sm">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
