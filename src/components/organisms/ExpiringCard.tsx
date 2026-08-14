import { ExpiringItem } from '../molecules/ExpiringItem';
import type { DDay } from '../../mock/home';

interface ExpiringCardProps {
  items: { emoji: string; name: string; location: string; dday: DDay }[];
  dateLabel: string;
}

export function ExpiringCard({ items, dateLabel }: ExpiringCardProps) {
  return (
    <section className="overflow-hidden rounded-[--radius-card] border border-line bg-surface shadow-[--shadow-soft]">
      <div className="flex items-center justify-between px-[22px] pt-5">
        <h2 className="text-base font-bold text-ink">유통기한 임박</h2>
        <span className="text-[12.5px] font-medium text-ink-muted">{dateLabel} 기준</span>
      </div>
      <ul className="px-3 pt-2 pb-3.5">
        {items.map((item) => (
          <ExpiringItem key={item.name} {...item} />
        ))}
      </ul>
    </section>
  );
}
