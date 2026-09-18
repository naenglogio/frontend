import { useEffect, useState } from 'react';
import { Button } from '../atoms/Button';
import {
  fetchFridgeOverview,
  updateWasteRateGoal,
  type FridgeOverview as FridgeOverviewData,
} from '../../services/profileApi';

export function FridgeOverview() {
  const [overview, setOverview] = useState<FridgeOverviewData | null>(null);
  const [goalInput, setGoalInput] = useState('10');
  const [goalSaving, setGoalSaving] = useState(false);
  const [goalSaved, setGoalSaved] = useState(false);
  const [goalError, setGoalError] = useState('');

  useEffect(() => {
    fetchFridgeOverview().then((data) => {
      setOverview(data);
      setGoalInput(String(data.wasteRateGoal));
    });
  }, []);

  if (!overview) {
    return <p className="py-5 text-center text-sm text-ink-muted">냉장고 정보를 불러오고 있어요...</p>;
  }

  const goalAchieved = overview.currentWasteRate <= overview.wasteRateGoal;
  const progress = Math.min((overview.currentWasteRate / overview.wasteRateGoal) * 100, 100);

  const saveGoal = async () => {
    const nextGoal = Number(goalInput);
    if (!Number.isInteger(nextGoal) || nextGoal < 1 || nextGoal > 100) {
      setGoalError('목표는 1~100 사이의 정수로 입력해주세요.');
      setGoalSaved(false);
      return;
    }

    setGoalSaving(true);
    setGoalError('');
    setGoalSaved(false);
    try {
      await updateWasteRateGoal(nextGoal);
      setOverview((current) => (current ? { ...current, wasteRateGoal: nextGoal } : current));
      setGoalSaved(true);
    } finally {
      setGoalSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ['보관 중', `${overview.storedCount}개`],
          ['소비기한 임박', `${overview.expiringCount}개`],
          ['이번 달 등록', `${overview.addedThisMonth}개`],
          [
            '가장 오래된 재료',
            overview.oldestIngredient
              ? `${overview.oldestIngredient.name} · ${overview.oldestIngredient.storedDays}일`
              : '없음',
          ],
        ].map(([label, value]) => (
          <div key={label} className="rounded-input bg-surface-muted p-4">
            <p className="text-xs text-ink-muted">{label}</p>
            <p className="mt-2 text-base font-bold text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-input border border-line p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-ink">이번 달 폐기율 목표</p>
            <p className="mt-1 text-xs text-ink-muted">목표 {overview.wasteRateGoal}% 이하</p>
          </div>
          <span className={`text-lg font-bold ${goalAchieved ? 'text-fresh' : 'text-danger'}`}>
            현재 {overview.currentWasteRate}%
          </span>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-surface-muted">
          <div
            className={`h-full rounded-full ${goalAchieved ? 'bg-fresh' : 'bg-danger'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className={`mt-3 text-xs font-medium ${goalAchieved ? 'text-fresh' : 'text-danger'}`}>
          {goalAchieved ? '목표를 잘 지키고 있어요!' : '조금만 더 신경 써서 식재료를 소비해보세요.'}
        </p>

        <form
          className="mt-5 border-t border-line pt-4"
          onSubmit={(event) => {
            event.preventDefault();
            void saveGoal();
          }}
        >
          <label htmlFor="waste-rate-goal" className="text-sm font-semibold text-ink-soft">
            목표 폐기율 설정
          </label>
          <div className="mt-2 flex items-center gap-2">
            <div className="relative w-40">
              <input
                id="waste-rate-goal"
                type="number"
                min="1"
                max="100"
                step="1"
                value={goalInput}
                onChange={(event) => {
                  setGoalInput(event.target.value);
                  setGoalError('');
                  setGoalSaved(false);
                }}
                className="h-11 w-full rounded-input border border-line bg-surface pr-9 pl-3 text-sm font-medium text-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-ink-muted">
                %
              </span>
            </div>
            <Button type="submit" loading={goalSaving} className="h-11 py-0">
              목표 저장
            </Button>
          </div>
          {goalError && <p className="mt-2 text-xs text-danger">{goalError}</p>}
          {goalSaved && <p className="mt-2 text-xs text-fresh">새 목표를 저장했어요.</p>}
        </form>
      </div>
    </div>
  );
}
