import { IngredientStats } from '../organisms/IngredientStats';
import { ProfileSettingsForm } from '../organisms/ProfileSettingsForm';

export function ProfilePage() {
  return (
    <main className="min-h-screen bg-surface-muted px-4 py-10">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold text-ink">내 정보</h1>
          <p className="mt-1 text-sm text-ink-muted">계정 정보와 냉장고 이용 통계를 확인해보세요</p>
        </div>

        <section className="rounded-card bg-surface p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-base">
              👤
            </span>
            <h2 className="text-base font-bold text-ink">계정 설정</h2>
          </div>
          <ProfileSettingsForm />
        </section>

        <section className="rounded-card bg-surface p-6 shadow-soft">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-base">
              📊
            </span>
            <h2 className="text-base font-bold text-ink">식재료 통계</h2>
          </div>
          <IngredientStats />
        </section>
      </div>
    </main>
  );
}
