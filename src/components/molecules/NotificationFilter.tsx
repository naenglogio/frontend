export type NotificationFilterMode = 'all' | 'expired' | 'd1' | 'd3' | 'd7';

interface NotificationFilterProps {
  value: NotificationFilterMode;
  onChange: (value: NotificationFilterMode) => void;
}

const OPTIONS: { value: NotificationFilterMode; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'expired', label: '만료' },
  { value: 'd1', label: '1일전' },
  { value: 'd3', label: '3일전' },
  { value: 'd7', label: '7일전' },
];

export function NotificationFilter({ value, onChange }: NotificationFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full border px-2.5 py-1 text-[11.5px] font-semibold transition-colors ${
            value === option.value
              ? 'border-primary-500 bg-primary-50 text-primary-700'
              : 'border-line text-ink-muted hover:border-primary-200 hover:text-ink-soft'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
