import type { ReactNode } from 'react';
import type { DdayTone } from '../../utils/dday';

interface BadgeProps {
  tone: DdayTone;
  children: ReactNode;
  className?: string;
}

const toneClass: Record<DdayTone, string> = {
  fresh: 'bg-fresh/10 text-fresh',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
};

export function Badge({ tone, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${toneClass[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
