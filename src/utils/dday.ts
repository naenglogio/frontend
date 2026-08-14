export type DdayTone = 'fresh' | 'warning' | 'danger';

export function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function getDdayInfo(dateStr: string): { label: string; tone: DdayTone } {
  const days = getDaysUntil(dateStr);
  if (days > 3) return { label: `D-${days}`, tone: 'fresh' };
  if (days > 0) return { label: `D-${days}`, tone: 'warning' };
  if (days === 0) return { label: 'D-DAY', tone: 'danger' };
  return { label: `D+${Math.abs(days)}`, tone: 'danger' };
}
