interface MartListItemProps {
  name: string;
  distanceKm: number;
  isOpen: boolean;
  onClick?: () => void;
}

export function MartListItem({ name, distanceKm, isOpen, onClick }: MartListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-[--radius-card] border border-line bg-surface px-4 py-3.5 text-left shadow-[--shadow-soft] transition-colors hover:bg-primary-50"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">{name}</p>
        <p className="mt-0.5 text-xs text-ink-muted">
          {distanceKm}km · {isOpen ? '영업중' : '영업종료'}
        </p>
      </div>
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-ink-muted" fill="none" aria-hidden="true">
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
