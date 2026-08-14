import { ExpiringCard } from '../organisms/ExpiringCard';
import { FridgeCard } from '../organisms/FridgeCard';
import { RecipeSection } from '../organisms/RecipeSection';
import { Sidebar } from '../organisms/Sidebar';
import { StatStrip } from '../organisms/StatStrip';
import { TopBar } from '../organisms/TopBar';
import { expiringItems, fridge, recipes, stats, user } from '../../mock/home';

function formatDateLabel(date: Date) {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yy}/${mm}/${dd}`;
}

export function MainPage() {
  const dateLabel = formatDateLabel(new Date());

  return (
    <div className="min-h-screen bg-surface-muted lg:grid lg:grid-cols-[264px_1fr]">
      <Sidebar userName={user.name} initial={user.initial} />

      <main className="mx-auto w-full max-w-[1180px] px-6 py-6 lg:px-10 lg:pt-[30px] lg:pb-[60px]">
        <TopBar userName={user.name} expiringCount={stats.expiring} />
        <StatStrip total={stats.total} expiring={stats.expiring} fresh={stats.fresh} />

        <div className="grid grid-cols-1 gap-[22px] lg:grid-cols-[1.35fr_1fr]">
          <FridgeCard cold={fridge.cold} frozen={fridge.frozen} expiring={fridge.expiring} />
          <ExpiringCard items={expiringItems} dateLabel={dateLabel} />
        </div>

        <RecipeSection recipes={recipes} />
      </main>
    </div>
  );
}
