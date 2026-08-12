import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  loading?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600',
  secondary: 'bg-surface-muted text-ink-soft hover:bg-primary-50',
};

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-input px-4 py-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variantClass[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? '처리 중...' : children}
    </button>
  );
}
