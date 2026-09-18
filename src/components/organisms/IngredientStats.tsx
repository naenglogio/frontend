import { useEffect, useState } from 'react';
import { Button } from '../atoms/Button';
import { RankBadge } from '../atoms/RankBadge';
import { StatCard } from '../atoms/StatCard';
import {
  fetchIngredientStats,
  STATS_PERIOD_OPTIONS,
  type IngredientFrequencyItem,
  type IngredientStats as IngredientStatsData,
  type StatsPeriod,
} from '../../services/profileApi';

type Tone = 'fresh' | 'danger';

const toneBarClass: Record<Tone, string> = {
  fresh: 'bg-fresh',
  danger: 'bg-danger',
};

const toneTrackClass: Record<Tone, string> = {
  fresh: 'bg-fresh/10',
  danger: 'bg-danger/10',
};

function FrequencyChart({
  title,
  description,
  items,
  tone,
}: {
  title: string;
  description: string;
  items: IngredientFrequencyItem[];
  tone: Tone;
}) {
  const topItems = items.slice(0, 5);
  const maxCount = Math.max(...topItems.map((item) => item.count), 0);

  return (
    <section className="rounded-input border border-line p-4">
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      <p className="mt-1 text-xs text-ink-muted">{description}</p>

      {topItems.length === 0 ? (
        <p className="py-8 text-center text-sm text-ink-muted">아직 데이터가 없어요.</p>
      ) : (
        <ol className="mt-5 flex flex-col gap-4">
          {topItems.map((item, index) => {
            const percent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            return (
              <li key={item.name}>
                <div className="mb-1.5 flex items-center gap-2 text-sm">
                  <RankBadge rank={index + 1} tone={tone} />
                  <span className="min-w-0 flex-1 truncate font-medium text-ink-soft">
                    {item.name}
                  </span>
                  <span className="font-bold text-ink">{item.count}회</span>
                </div>
                <div
                  className={`ml-8 h-2.5 overflow-hidden rounded-full ${toneTrackClass[tone]}`}
                  role="img"
                  aria-label={`${item.name} ${item.count}회`}
                >
                  <div
                    className={`h-full rounded-full transition-[width] duration-300 ${toneBarClass[tone]}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}

export function IngredientStats() {
  const [selectedPeriod, setSelectedPeriod] = useState<StatsPeriod>('7d');
  const [appliedPeriod, setAppliedPeriod] = useState<StatsPeriod>('7d');
  const [stats, setStats] = useState<IngredientStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    fetchIngredientStats('7d')
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        if (!cancelled) setError('통계를 불러오지 못했어요. 다시 시도해주세요.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const applyPeriod = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchIngredientStats(selectedPeriod);
      setStats(data);
      setAppliedPeriod(selectedPeriod);
    } catch {
      setError('통계를 불러오지 못했어요. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const periodLabel =
    STATS_PERIOD_OPTIONS.find((option) => option.value === appliedPeriod)?.label ?? '';
  const totalCount = stats ? stats.eatenCount + stats.discardedCount : 0;
  const discardedRate =
    stats && totalCount > 0 ? Math.round((stats.discardedCount / totalCount) * 100) : 0;
  const eatenRate = totalCount > 0 ? 100 - discardedRate : 0;

  return (
    <div className="flex flex-col gap-6">
      <form
        className="rounded-input bg-surface-muted p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void applyPeriod();
        }}
      >
        <label htmlFor="stats-period" className="text-sm font-semibold text-ink-soft">
          조회 기간
        </label>
        <div className="mt-2 flex items-center gap-2">
          <select
            id="stats-period"
            value={selectedPeriod}
            onChange={(event) => setSelectedPeriod(event.target.value as StatsPeriod)}
            className="h-11 min-w-0 flex-1 rounded-input border border-line bg-surface px-3 text-sm font-medium text-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 sm:max-w-sm"
          >
            {STATS_PERIOD_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                최근 {option.label}
              </option>
            ))}
          </select>
          <Button type="submit" loading={loading} className="h-11 min-w-20 py-0">
            확인
          </Button>
        </div>
      </form>

      {error ? (
        <p className="rounded-input bg-danger/10 px-4 py-5 text-center text-sm text-danger">
          {error}
        </p>
      ) : !stats ? (
        <p className="py-8 text-center text-sm text-ink-muted">통계를 불러오고 있어요...</p>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-ink">최근 {periodLabel} 이용 요약</h3>
              <p className="mt-1 text-xs text-ink-muted">냉장고에서 처리한 식재료 기준이에요.</p>
            </div>
            {loading && <span className="text-xs font-medium text-primary-600">업데이트 중...</span>}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard label="먹은 식재료" value={stats.eatenCount} tone="fresh" />
            <StatCard label="버린 식재료" value={stats.discardedCount} tone="danger" />
            <StatCard label="폐기율" value={discardedRate} unit="%" />
          </div>

          <section className="rounded-input border border-line p-4 sm:p-5">
            <div>
              <h3 className="text-sm font-bold text-ink">소비와 폐기 비율</h3>
              <p className="mt-1 text-xs text-ink-muted">선택한 기간의 식재료 처리 결과예요.</p>
            </div>

            <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-12">
              <div
                className="relative h-44 w-44 shrink-0"
                role="img"
                aria-label={`총 ${totalCount}개 중 먹은 식재료 ${stats.eatenCount}개 ${eatenRate}퍼센트, 버린 식재료 ${stats.discardedCount}개 ${discardedRate}퍼센트`}
              >
                <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    fill="none"
                    strokeWidth="16"
                    className="stroke-surface-muted"
                  />
                  {totalCount > 0 && (
                    <>
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        pathLength="100"
                        fill="none"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={`${eatenRate} ${100 - eatenRate}`}
                        className="stroke-fresh transition-all duration-500"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="48"
                        pathLength="100"
                        fill="none"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={`${discardedRate} ${100 - discardedRate}`}
                        strokeDashoffset={-eatenRate}
                        className="stroke-danger transition-all duration-500"
                      />
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-medium text-ink-muted">총 처리</span>
                  <strong className="mt-1 text-2xl font-bold text-ink">{totalCount}</strong>
                  <span className="text-xs text-ink-muted">개</span>
                </div>
              </div>

              <div className="grid w-full max-w-xs grid-cols-2 gap-3 sm:grid-cols-1">
                <div className="rounded-input bg-fresh/10 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <span className="h-3 w-3 rounded-full bg-fresh" /> 먹은 식재료
                  </div>
                  <p className="mt-2 text-xl font-bold text-fresh">
                    {stats.eatenCount}개 <span className="text-sm">({eatenRate}%)</span>
                  </p>
                </div>
                <div className="rounded-input bg-danger/10 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <span className="h-3 w-3 rounded-full bg-danger" /> 버린 식재료
                  </div>
                  <p className="mt-2 text-xl font-bold text-danger">
                    {stats.discardedCount}개 <span className="text-sm">({discardedRate}%)</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FrequencyChart
              title="자주 먹는 식재료"
              description="소비 횟수가 많은 순서예요."
              items={stats.frequentlyEaten}
              tone="fresh"
            />
            <FrequencyChart
              title="자주 버리는 식재료"
              description="다음 장보기 전에 확인해보세요."
              items={stats.frequentlyDiscarded}
              tone="danger"
            />
          </div>
        </>
      )}
    </div>
  );
}
