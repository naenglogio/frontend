export function NearbyMartMap() {
  return (
    <div className="relative flex h-56 items-center justify-center overflow-hidden rounded-[--radius-card] bg-[linear-gradient(160deg,var(--color-primary-50)_0%,var(--color-primary-100)_100%)]">
      <span className="absolute top-6 text-xs font-semibold text-ink-soft">이마트</span>

      <div className="relative flex h-24 w-24 items-center justify-center">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-ink-soft" fill="none" aria-hidden="true">
          <path d="M50 8 L90 40 V90 H10 V40 Z" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
        </svg>
        <span className="h-3.5 w-3.5 rounded-full bg-primary-600" />
      </div>

      <span className="absolute top-1/2 right-8 -translate-y-1/2 text-xs font-semibold text-ink-muted">GS25</span>
    </div>
  );
}
