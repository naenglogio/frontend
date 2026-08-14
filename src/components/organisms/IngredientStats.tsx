import { useEffect, useState } from 'react';
import { RankBadge } from '../atoms/RankBadge';
import { SegmentedControl } from '../atoms/SegmentedControl';
import { StatCard } from '../atoms/StatCard';
import {
  fetchIngredientStats,
  STATS_PERIOD_OPTIONS,
  type IngredientFrequencyItem,
  type IngredientStats as IngredientStatsData,
  type StatsPeriod,
} from '../../services/profileApi';

type ViewMode = 'list' | 'chart';

const VIEW_MODE_OPTIONS: { value: ViewMode; label: string }[] = [
  { value: 'list', label: '리스트로 보기' },
  { value: 'chart', label: '그래프로 보기' },
];

type Tone = 'fresh' | 'danger';

const toneBarClass: Record<Tone, string> = {
  fresh: 'bg-fresh',
  danger: 'bg-danger',
};

const toneTrackClass: Record<Tone, string> = {
  fresh: 'bg-fresh/10',
  danger: 'bg-danger/10',
};

function FrequencyRankList({ items, tone }: { items: IngredientFrequencyItem[]; tone: Tone }) {
  if (items.length === 0) {
    return <p className="text-sm text-ink-muted">아직 데이터가 없어요.</p>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item, index) => (
        <li
          key={item.name}
          className="flex items-center gap-3 rounded-input bg-surface-muted px-4 py-2.5 text-sm"
        >
          <RankBadge rank={index + 1} tone={tone} />
          <span className="flex-1 text-ink-soft">{item.name}</span>
          <span className="font-semibold text-ink">{item.count}회</span>
        </li>
      ))}
    </ul>
  );
}

function FrequencyBarChart({ items, tone }: { items: IngredientFrequencyItem[]; tone: Tone }) {
  if (items.length === 0) {
    return <p className="text-sm text-ink-muted">아직 데이터가 없어요.</p>;
  }
  const maxCount = Math.max(...items.map((item) => item.count));
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const percent = maxCount > 0 ? Math.max((item.count / maxCount) * 100, 8) : 0;
        return (
          <li key={item.name} className="flex items-center gap-3">
            <span className="w-14 shrink-0 truncate text-sm text-ink-soft">{item.name}</span>
            <div className={`h-4 flex-1 overflow-hidden rounded-r ${toneTrackClass[tone]}`}>
              <div
                className={`h-full rounded-r ${toneBarClass[tone]}`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <span className="w-9 shrink-0 text-right text-sm font-semibold text-ink">
              {item.count}회
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function IngredientStats() {
  const [period, setPeriod] = useState<StatsPeriod>('7d');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [stats, setStats] = useState<IngredientStatsData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchIngredientStats(period).then((data) => {
      if (!cancelled) setStats(data);
    });
    return () => {
      cancelled = true;
    };
  }, [period]);

  return (
    <div className="flex flex-col gap-5">
      <SegmentedControl options={STATS_PERIOD_OPTIONS} value={period} onChange={setPeriod} />

      {!stats ? (
        <p className="py-6 text-center text-sm text-ink-muted">불러오는 중...</p>
      ) : (
        <>
          <div className="flex gap-3">
            <StatCard label="먹은 식재료" value={stats.eatenCount} tone="fresh" />
            <StatCard label="버린 식재료" value={stats.discardedCount} tone="danger" />
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">식재료 순위</p>
            <SegmentedControl options={VIEW_MODE_OPTIONS} value={viewMode} onChange={setViewMode} />
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-ink">자주 먹는 식재료</p>
            {viewMode === 'list' ? (
              <FrequencyRankList items={stats.frequentlyEaten} tone="fresh" />
            ) : (
              <FrequencyBarChart items={stats.frequentlyEaten} tone="fresh" />
            )}
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-ink">자주 버리는 식재료</p>
            {viewMode === 'list' ? (
              <FrequencyRankList items={stats.frequentlyDiscarded} tone="danger" />
            ) : (
              <FrequencyBarChart items={stats.frequentlyDiscarded} tone="danger" />
            )}
          </div>
        </>
      )}
    </div>
  );
}
