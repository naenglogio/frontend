import { useMemo, useState } from 'react';
import { NotificationFilter } from '../molecules/NotificationFilter';
import type { NotificationFilterMode } from '../molecules/NotificationFilter';
import { NotificationItem } from '../molecules/NotificationItem';
import { MOCK_NOTIFICATIONS } from '../../mock/notifications';

export function NotificationPanel() {
  const [filter, setFilter] = useState<NotificationFilterMode>('all');
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleNotifications = useMemo(() => {
    const filtered =
      filter === 'all' ? notifications : notifications.filter((n) => n.category === filter);
    return [...filtered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [notifications, filter]);

  return (
    <div
      role="dialog"
      aria-label="알림 센터"
      className="w-[340px] overflow-hidden rounded-card border border-line bg-surface shadow-soft"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
        <h2 className="text-sm font-bold text-ink">알림 센터</h2>
        <button
          type="button"
          onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
          className="text-xs font-semibold text-primary-600 hover:text-primary-700"
        >
          모두 읽음
        </button>
      </div>

      <div className="border-b border-line px-4 py-3">
        <NotificationFilter value={filter} onChange={setFilter} />
      </div>

      <ul className="flex max-h-[420px] flex-col gap-2 overflow-y-auto px-3 py-3">
        {visibleNotifications.length === 0 ? (
          <li className="py-8 text-center text-sm text-ink-muted">표시할 알림이 없어요</li>
        ) : (
          visibleNotifications.map((n) => (
            <NotificationItem
              key={n.id}
              notification={n}
              selected={selectedId === n.id}
              onSelect={() => setSelectedId((prev) => (prev === n.id ? null : n.id))}
              onConfirm={() => {
                setNotifications((prev) =>
                  prev.map((item) => (item.id === n.id ? { ...item, read: true } : item)),
                );
                setSelectedId(null);
              }}
              onDelete={() => {
                setNotifications((prev) => prev.filter((item) => item.id !== n.id));
                setSelectedId(null);
              }}
            />
          ))
        )}
      </ul>

      <div className="border-t border-line px-3 py-3">
        <button
          type="button"
          className="w-full rounded-input bg-surface-muted py-2.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-primary-50"
        >
          ⚙ 알림 설정
        </button>
      </div>
    </div>
  );
}
