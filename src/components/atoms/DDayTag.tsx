import type { DDay } from '../../mock/home';

interface DDayTagProps {
  dday: DDay;
}

const styleMap: Record<DDay, { label: string; className: string }> = {
  0: { label: '오늘까지', className: 'bg-danger/10 text-danger' },
  1: { label: '내일까지', className: 'bg-warning/10 text-warning' },
  3: { label: '3일 남음', className: 'bg-primary-600/10 text-primary-600' },
};

export function DDayTag({ dday }: DDayTagProps) {
  const { label, className } = styleMap[dday];
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11.5px] font-bold whitespace-nowrap ${className}`}>
      {label}
    </span>
  );
}
