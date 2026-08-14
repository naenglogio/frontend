export type NavIconId = 'home' | 'fridge' | 'ingredients' | 'recipes' | 'stats';

interface NavIconProps {
  id: NavIconId;
  className?: string;
}

export function NavIcon({ id, className = 'h-[19px] w-[19px]' }: NavIconProps) {
  const common = {
    viewBox: '0 0 24 24',
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    'aria-hidden': true as const,
  };

  switch (id) {
    case 'home':
      return (
        <svg {...common}>
          <path d="M3 10l9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <path d="M9 21V12h6v9" />
        </svg>
      );
    case 'fridge':
      return (
        <svg {...common}>
          <rect x="6" y="2" width="12" height="20" rx="3" />
          <path d="M6 11h12" />
          <path d="M9 6v2M9 14v2" />
        </svg>
      );
    case 'ingredients':
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" />
        </svg>
      );
    case 'recipes':
      return (
        <svg {...common}>
          <path d="M12 3a6 6 0 0 0-6 6c0 2 1 3 2 4l1 3h6l1-3c1-1 2-2 2-4a6 6 0 0 0-6-6z" />
          <path d="M9 21h6" strokeLinecap="round" />
        </svg>
      );
    case 'stats':
      return (
        <svg {...common}>
          <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 14l3-3 3 3 4-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}
