export type RecipeFilterMode = 'all' | 'korean' | 'western' | 'quick' | 'expiring';

interface RecipeFilterChipsProps {
  value: RecipeFilterMode;
  onChange: (value: RecipeFilterMode) => void;
}

const OPTIONS: { value: RecipeFilterMode; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'korean', label: '한식' },
  { value: 'western', label: '양식' },
  { value: 'quick', label: '20분 이내' },
  { value: 'expiring', label: '만료 임박 우선' },
];

export function RecipeFilterChips({ value, onChange }: RecipeFilterChipsProps) {
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
