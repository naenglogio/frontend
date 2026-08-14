export type SortMode = 'latest' | 'expiry' | 'category';

interface SortFilterProps {
  value: SortMode;
  onChange: (value: SortMode) => void;
}

const OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'latest', label: '최신순' },
  { value: 'expiry', label: '유통기한 임박순' },
  { value: 'category', label: '카테고리순' },
];

export function SortFilter({ value, onChange }: SortFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
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
