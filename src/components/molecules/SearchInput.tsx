interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = '식재료 이름으로 검색',
}: SearchInputProps) {
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-input border border-line bg-surface py-3 pr-4 pl-10 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
      />
    </div>
  );
}
