interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-input px-3 py-1.5 text-sm font-medium transition-colors ${
            value === option.value
              ? 'bg-primary-500 text-white'
              : 'bg-surface-muted text-ink-soft hover:bg-primary-50'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
