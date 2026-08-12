import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  action?: ReactNode;
}

export function Input({ label, error, action, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink-soft">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          className={`min-w-0 flex-1 rounded-input border bg-surface px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:ring-2 ${
            error
              ? 'border-danger focus:ring-danger/10'
              : 'border-line focus:border-primary-400 focus:ring-primary-100'
          } ${className}`}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {action}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
