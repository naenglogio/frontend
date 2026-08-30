import { Badge } from '../atoms/Badge';
import { CATEGORY_TONE } from '../../mock/notifications';
import type { AppNotification } from '../../mock/notifications';
import type { DdayTone } from '../../utils/dday';

interface NotificationItemProps {
  notification: AppNotification;
  selected: boolean;
  onSelect: () => void;
  onConfirm: () => void;
  onDelete: () => void;
}

const ACCENT_CLASS: Record<DdayTone, string> = {
  danger: 'border-l-danger',
  warning: 'border-l-warning',
  fresh: 'border-l-fresh',
};

export function NotificationItem({
  notification,
  selected,
  onSelect,
  onConfirm,
  onDelete,
}: NotificationItemProps) {
  const { category, badgeLabel, title, meta, timeAgo, read } = notification;
  const tone = CATEGORY_TONE[category];

  return (
    <li
      className={`flex items-start overflow-hidden rounded-input border border-line border-l-4 bg-surface ${ACCENT_CLASS[tone]}`}
    >
      <button
        type="button"
        onClick={onSelect}
        className={`relative min-w-0 flex-1 px-3.5 py-3 text-left outline-none transition-colors ${
          selected ? 'bg-primary-50' : ''
        }`}
      >
        {!read && <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary-500" />}
        <div className="flex items-center justify-between gap-2 pr-4">
          <Badge tone={tone}>{badgeLabel}</Badge>
          <span className="text-[11px] whitespace-nowrap text-ink-muted">{timeAgo}</span>
        </div>
        <p className="mt-2 text-sm font-semibold wrap-break-word text-ink">{title}</p>
        {meta && <p className="mt-1 text-xs text-ink-muted">{meta}</p>}
      </button>

      {selected && (
        <div className="flex shrink-0 flex-row justify-center gap-1.5 self-stretch border-l border-line px-2.5 py-5">
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-input bg-primary-500 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-primary-600"
          >
            확인
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-input bg-danger px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-danger/90"
          >
            삭제
          </button>
        </div>
      )}
    </li>
  );
}
