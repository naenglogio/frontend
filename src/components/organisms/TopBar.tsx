import { useEffect, useRef, useState } from 'react';
import { Button } from '../atoms/Button';
import { NotificationPanel } from './NotificationPanel';

interface TopBarProps {
  userName: string;
  expiringCount: number;
}

export function TopBar({ userName, expiringCount }: TopBarProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notifOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setNotifOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [notifOpen]);

  return (
    <header className="mb-[30px] flex flex-col items-start justify-between gap-3.5 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold text-ink">안녕하세요, {userName}님 👋</h1>
        <p className="mt-1.5 text-sm text-ink-soft">
          오늘 냉장고에 유통기한이 임박한 재료가{' '}
          <span className="font-bold text-ink">{expiringCount}개</span> 있어요.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div ref={wrapperRef} className="relative">
          <button
            type="button"
            aria-label="알림"
            aria-expanded={notifOpen}
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative grid h-[42px] w-[42px] place-items-center rounded-xl border border-line bg-surface text-ink-soft shadow-soft transition hover:border-primary-200 hover:shadow-[--shadow-soft]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path
                d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M13.7 21a2 2 0 0 1-3.4 0" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="absolute top-[9px] right-2.5 h-2 w-2 rounded-full border-2 border-surface bg-danger" />
          </button>

          {notifOpen && (
            <div className="absolute top-[calc(100%+10px)] right-0 z-50">
              <NotificationPanel />
            </div>
          )}
        </div>

        <Button className="inline-flex h-[42px] items-center gap-2 px-5 py-0">
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          재료 추가
        </Button>
      </div>
    </header>
  );
}
