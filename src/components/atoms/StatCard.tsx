type StatCardTone = 'fresh' | 'danger' | 'neutral';

interface StatCardProps {
  label: string;
  value: number;
  unit?: string;
  tone?: StatCardTone;
}

const toneTextClass: Record<StatCardTone, string> = {
  fresh: 'text-fresh',
  danger: 'text-danger',
  neutral: 'text-ink',
};

const toneBgClass: Record<StatCardTone, string> = {
  fresh: 'bg-fresh/10',
  danger: 'bg-danger/10',
  neutral: 'bg-surface-muted',
};

export function StatCard({ label, value, unit = '개', tone = 'neutral' }: StatCardProps) {
  return (
    <div className={`flex-1 rounded-input px-4 py-4 ${toneBgClass[tone]}`}>
      <p className="text-xs font-medium text-ink-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${toneTextClass[tone]}`}>
        {value}
        <span className="ml-1 text-sm font-medium text-ink-muted">{unit}</span>
      </p>
    </div>
  );
}
