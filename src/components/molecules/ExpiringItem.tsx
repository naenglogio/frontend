import { DDayTag } from '../atoms/DDayTag';
import type { DDay } from '../../mock/home';

interface ExpiringItemProps {
  emoji: string;
  name: string;
  location: string;
  dday: DDay;
}

export function ExpiringItem({ emoji, name, location, dday }: ExpiringItemProps) {
  return (
    <li className="flex items-center gap-3 rounded-[12px] px-3 py-3 transition-colors hover:bg-primary-50">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] bg-primary-50 text-xl">
        {emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{name}</p>
        <p className="text-xs text-ink-muted">{location}</p>
      </div>
      <DDayTag dday={dday} />
    </li>
  );
}
