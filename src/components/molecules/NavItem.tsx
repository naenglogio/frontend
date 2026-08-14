import { NavIcon, type NavIconId } from '../atoms/NavIcon';

interface NavItemProps {
  icon: NavIconId;
  label: string;
  active?: boolean;
}

export function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <button
      type="button"
      aria-current={active ? 'page' : undefined}
      className={`flex items-center gap-3 rounded-[11px] px-3.5 py-[11px] text-[14.5px] transition-colors ${
        active
          ? 'bg-white/20 font-semibold text-white'
          : 'font-medium text-white/80 hover:bg-white/10 hover:text-white'
      }`}
    >
      <NavIcon id={icon} />
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}
