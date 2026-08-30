import { Link } from 'react-router';
import { NavIcon, type NavIconId } from '../atoms/NavIcon';

interface NavItemProps {
  icon: NavIconId;
  label: string;
  active?: boolean;
  to?: string;
}

export function NavItem({ icon, label, active = false, to }: NavItemProps) {
  const className = `flex items-center gap-3 rounded-[11px] px-3.5 py-[11px] text-[14.5px] transition-colors ${
    active
      ? 'bg-white/20 font-semibold text-white'
      : 'font-medium text-white/80 hover:bg-white/10 hover:text-white'
  }`;

  const content = (
    <>
      <NavIcon id={icon} />
      <span className="hidden lg:inline">{label}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} aria-current={active ? 'page' : undefined} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" aria-current={active ? 'page' : undefined} className={className}>
      {content}
    </button>
  );
}
