import { Link } from 'react-router';
import { AccountManagement } from '../organisms/AccountManagement';
import { FridgeOverview } from '../organisms/FridgeOverview';
import { IngredientStats } from '../organisms/IngredientStats';
import { ProfileNotificationSettings } from '../organisms/ProfileNotificationSettings';
import { ProfileSettingsForm } from '../organisms/ProfileSettingsForm';

function Section({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card bg-surface p-5 shadow-soft sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-base">
          {icon}
        </span>
        <div>
          <h2 className="text-base font-bold text-ink">{title}</h2>
          <p className="mt-1 text-xs text-ink-muted">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export function ProfilePage() {
  return (
    <main className="min-h-screen bg-surface-muted px-4 py-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-ink">내 정보</h1>
            <p className="mt-1 text-sm text-ink-muted">계정 설정과 냉장고 이용 현황을 관리해보세요.</p>
          </div>
          <Link to="/" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
            홈으로
          </Link>
        </div>

        <Section icon="👤" title="계정 설정" description="닉네임, 이메일과 비밀번호를 관리합니다.">
          <ProfileSettingsForm />
        </Section>

        <Section icon="🔔" title="알림 설정" description="소비기한 알림 여부와 시점을 설정합니다.">
          <ProfileNotificationSettings />
        </Section>

        <Section icon="🧊" title="냉장고 이용 요약" description="현재 냉장고 상태와 이번 달 목표를 확인합니다.">
          <FridgeOverview />
        </Section>

        <Section icon="📊" title="식재료 통계" description="기간별 소비와 폐기 기록을 살펴봅니다.">
          <IngredientStats />
        </Section>

        <Section icon="⚙️" title="계정 관리" description="계정과 저장된 데이터의 삭제를 관리합니다.">
          <AccountManagement />
        </Section>
      </div>
    </main>
  );
}
