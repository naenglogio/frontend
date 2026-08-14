interface FridgeSummaryProps {
  cold: number;
  frozen: number;
  expiring: number;
  className?: string;
}

export function FridgeSummary({ cold, frozen, expiring, className = '' }: FridgeSummaryProps) {
  return (
    <div
      className={`relative flex h-[210px] w-[150px] cursor-grab flex-col overflow-hidden rounded-2xl border-2 border-primary-200 bg-surface shadow-soft transition-transform duration-300 hover:-translate-y-0.5 hover:-rotate-1 ${className}`}
      aria-label={`냉장실 ${cold}개, 냉동실 ${frozen}개, 임박 ${expiring}개`}
    >
      {expiring > 0 && (
        <span className="absolute top-2.5 right-2.5 z-10 grid h-[22px] min-w-[22px] place-items-center rounded-full bg-danger px-1.5 text-[11px] font-bold text-white">
          {expiring}
        </span>
      )}

      <div className="relative grid flex-1 place-items-center border-b-2 border-primary-200 bg-[linear-gradient(180deg,var(--color-primary-50),var(--color-primary-100))]">
        <span className="absolute top-3.5 right-2 h-10 w-1.5 rounded bg-primary-200" aria-hidden="true" />
        <span className="text-[30px] font-extrabold text-primary-600">{cold}</span>
        <span className="absolute bottom-3 text-[11px] font-semibold text-ink-muted">냉장실</span>
      </div>

      <div className="relative grid flex-[0.85] place-items-center bg-fresh/10">
        <span
          className="absolute right-2 bottom-3.5 h-10 w-1.5 rounded bg-primary-200"
          aria-hidden="true"
        />
        <span className="text-[30px] font-extrabold text-fresh">{frozen}</span>
        <span className="absolute bottom-3 text-[11px] font-semibold text-ink-muted">냉동실</span>
      </div>
    </div>
  );
}
