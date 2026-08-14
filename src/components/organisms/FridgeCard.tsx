import { FridgeSummary } from '../atoms/FridgeSummary';

interface FridgeCardProps {
  cold: number;
  frozen: number;
  expiring: number;
}

export function FridgeCard({ cold, frozen, expiring }: FridgeCardProps) {
  return (
    <section className="overflow-hidden rounded-[--radius-card] border border-line bg-surface shadow-[--shadow-soft]">
      <div className="flex items-center justify-between px-[22px] pt-5">
        <h2 className="text-base font-bold text-ink">오늘의 냉장고</h2>
        <button
          type="button"
          className="inline-flex items-center gap-0.5 text-[12.5px] font-semibold text-primary-600 hover:text-primary-700"
        >
          자세히 보기
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="px-[22px] pt-3.5 pb-6">
        <div className="flex flex-col items-center rounded-2xl bg-[linear-gradient(160deg,var(--color-primary-50)_0%,var(--color-primary-100)_100%)] p-[26px]">
          <p className="mb-[18px] flex items-center gap-1.5 text-[12.5px] text-primary-600/80">
            <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" aria-hidden="true">
              <path
                d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            드래그하여 냉장고 내부 확인
          </p>

          <FridgeSummary cold={cold} frozen={frozen} expiring={expiring} />

          <div className="mt-5 flex flex-wrap justify-center gap-x-[22px] gap-y-2 text-[12.5px] text-ink-soft">
            <span className="flex items-center gap-1.5">
              <i className="h-[11px] w-[11px] rounded-[3px] bg-primary-600" />
              냉장 {cold}
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-[11px] w-[11px] rounded-[3px] bg-fresh" />
              냉동 {frozen}
            </span>
            <span className="flex items-center gap-1.5">
              <i className="h-[11px] w-[11px] rounded-[3px] bg-danger" />
              임박 {expiring}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
