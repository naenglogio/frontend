import { FridgeIllustration } from '../atoms/FridgeIllustration';
import { NavItem } from '../molecules/NavItem';
import type { NavIconId } from '../atoms/NavIcon';

const NAV_ITEMS: { id: NavIconId; label: string }[] = [
  { id: 'home', label: '홈' },
  { id: 'fridge', label: '3D 냉장고' },
  { id: 'ingredients', label: '재료 목록' },
  { id: 'recipes', label: '레시피' },
  { id: 'stats', label: '통계' },
];

interface SidebarProps {
  userName: string;
  initial: string;
}

export function Sidebar({ userName, initial }: SidebarProps) {
  return (
    <aside className="flex flex-row items-center gap-[18px] bg-[linear-gradient(160deg,var(--color-primary-500)_0%,var(--color-primary-600)_55%,var(--color-primary-700)_100%)] px-5 py-4 text-white lg:sticky lg:top-0 lg:h-screen lg:w-[264px] lg:flex-col lg:items-stretch lg:px-[22px] lg:py-7">
      <div className="flex items-center gap-3 px-1.5 lg:mb-2 lg:px-1.5 lg:pb-2">
        <div className="relative flex h-11 w-10 shrink-0 items-center justify-center">
          <FridgeIllustration className="h-11 w-11" />
        </div>
        <div>
          <p className="text-xl font-bold tracking-wide">Naenglog</p>
          <p className="mt-0.5 hidden text-[11px] text-white/70 lg:block">잊혀진 재료들, 챙겨요</p>
        </div>
      </div>

      <nav
        className="flex flex-row gap-1 lg:mt-2 lg:flex-col"
        aria-label="주요 메뉴"
      >
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.id} icon={item.id} label={item.label} active={item.id === 'home'} />
        ))}
      </nav>

      <div className="ml-auto lg:mt-auto lg:ml-0 lg:pt-[18px]">
        <div className="flex items-center gap-[11px] rounded-xl bg-white/15 px-3 py-[11px]">
          <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-surface text-sm font-bold text-primary-700">
            {initial}
          </span>
          <div className="hidden leading-tight lg:block">
            <p className="text-[13px] font-semibold">{userName}</p>
            <p className="text-[11.5px] text-white/65">내 냉장고</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
