import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../atoms/Button';
import { NotificationPanel } from './NotificationPanel';

interface TopBarProps {
  userName: string;
  expiringCount: number;
}

/**
 * 메인(홈) 상단 바.
 * FE-4 연동: 스캔 → /ingredients/recognize, 재료 추가 → /ingredients/new (직접 등록).
 * 스캔과 직접 등록은 버튼을 분리한다.
 */
export function TopBar({ userName, expiringCount }: TopBarProps) {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 알림 패널: 바깥 클릭·Esc 로 닫기
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

      <div className="flex flex-wrap items-center gap-3">
        {/* 알림 벨 + 드롭다운 패널 */}
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

        {/* FE-4: 카메라/바코드/영수증 스캔 화면으로 이동 */}
        <Button
          type="button"
          variant="secondary"
          className="inline-flex h-[42px] items-center gap-2 px-4 py-0"
          onClick={() => navigate('/ingredients/recognize')}
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
            <path
              d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="2" />
          </svg>
          스캔
        </Button>

        {/* FE-3: 직접 등록 화면 (스캔과 분리) */}
        <Button
          type="button"
          className="inline-flex h-[42px] items-center gap-2 px-5 py-0"
          onClick={() => navigate('/ingredients/new')}
        >
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          재료 추가
        </Button>
      </div>
    </header>
  );
}
