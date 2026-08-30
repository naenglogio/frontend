import type { DdayTone } from '../utils/dday';

export type NotificationCategory = 'expired' | 'd1' | 'd3' | 'd7';

export interface AppNotification {
  id: string;
  category: NotificationCategory;
  badgeLabel: string;
  title: string;
  meta?: string;
  timeAgo: string;
  createdAt: string;
  read: boolean;
}

export const CATEGORY_TONE: Record<NotificationCategory, DdayTone> = {
  expired: 'danger',
  d1: 'warning',
  d3: 'warning',
  d7: 'fresh',
};

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    category: 'expired',
    badgeLabel: '만료 임박',
    title: '우유가 오늘 만료됩니다',
    meta: '냉장 · 900ml',
    timeAgo: '10분 전',
    createdAt: '2026-08-30T09:50:00',
    read: false,
  },
  {
    id: 'n2',
    category: 'd1',
    badgeLabel: 'D-1',
    title: '시금치 유통기한이 1일 남았어요',
    meta: '냉장 · 1단',
    timeAgo: '40분 전',
    createdAt: '2026-08-30T09:20:00',
    read: false,
  },
  {
    id: 'n3',
    category: 'd3',
    badgeLabel: 'D-3',
    title: '두부 유통기한이 3일 남았어요',
    meta: '냉장 · 1모',
    timeAgo: '1시간 전',
    createdAt: '2026-08-30T09:00:00',
    read: false,
  },
  {
    id: 'n4',
    category: 'd7',
    badgeLabel: 'D-7',
    title: '체다치즈 유통기한이 7일 남았어요',
    meta: '냉장 · 5장',
    timeAgo: '3시간 전',
    createdAt: '2026-08-30T07:00:00',
    read: true,
  },
];
