type StatVariant = 'total' | 'warn' | 'fresh';

interface StatIconProps {
  variant: StatVariant;
}

const wrapClass: Record<StatVariant, string> = {
  total: 'bg-primary-50 text-primary-600',
  warn: 'bg-danger/10 text-danger',
  fresh: 'bg-fresh/10 text-fresh',
};

export function StatIcon({ variant }: StatIconProps) {
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[--radius-input] ${wrapClass[variant]}`}
      aria-hidden="true"
    >
      {variant === 'total' && (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <rect x="6" y="2" width="12" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M6 11h12" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
      {variant === 'warn' && (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path
            d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {variant === 'fresh' && (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
          <path
            d="M20 6 9 17l-5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}
