import type { StorageType } from '../../types';

interface StorageTabsProps {
  value: StorageType;
  onChange: (value: StorageType) => void;
}

const TABS: { value: StorageType; label: string }[] = [
  { value: 'fridge', label: '냉장고' },
  { value: 'freezer', label: '냉동고' },
];

export function StorageTabs({ value, onChange }: StorageTabsProps) {
  return (
    <div className="inline-flex rounded-input bg-surface-muted p-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={`rounded-input px-6 py-2 text-sm font-semibold transition-colors ${
            value === tab.value
              ? 'bg-surface text-primary-700 shadow-soft'
              : 'text-ink-muted hover:text-ink-soft'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
