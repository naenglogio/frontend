import { StatIcon } from '../atoms/StatIcon';

type StatVariant = 'total' | 'warn' | 'fresh';

interface StatCardProps {
  variant: StatVariant;
  count: number;
  label: string;
}

export function StatCard({ variant, count, label }: StatCardProps) {
  return (
    <article className="flex items-center gap-3.5 rounded-[--radius-input] border border-line bg-surface px-5 py-[18px] shadow-soft">
      <StatIcon variant={variant} />
      <div>
        <p className="text-[26px] leading-none font-bold text-ink">{count}</p>
        <p className="mt-1.5 text-[12.5px] text-ink-soft">{label}</p>
      </div>
    </article>
  );
}
