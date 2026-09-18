import { useEffect, useState } from 'react';
import { ToggleSwitch } from '../atoms/ToggleSwitch';
import {
  fetchProfile,
  updateNotificationDaysBefore,
  updateNotificationPreference,
} from '../../services/profileApi';

const NOTIFICATION_DAY_OPTIONS = [0, 1, 3, 7];

export function ProfileNotificationSettings() {
  const [agreed, setAgreed] = useState(false);
  const [daysBefore, setDaysBefore] = useState(3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile().then((profile) => {
      setAgreed(profile.notificationAgreed);
      setDaysBefore(profile.notificationDaysBefore);
      setLoading(false);
    });
  }, []);

  const changeAgreed = async (next: boolean) => {
    setAgreed(next);
    setSaving(true);
    try {
      await updateNotificationPreference(next);
    } finally {
      setSaving(false);
    }
  };

  const changeDaysBefore = async (next: number) => {
    setDaysBefore(next);
    setSaving(true);
    try {
      await updateNotificationDaysBefore(next);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4 rounded-input bg-primary-50 p-4">
        <div>
          <p className="text-sm font-semibold text-ink">소비기한 알림</p>
          <p className="mt-1 text-xs text-ink-muted">식재료가 상하기 전에 알려드릴게요.</p>
        </div>
        <ToggleSwitch
          id="notification-agreed"
          checked={agreed}
          onChange={(next) => void changeAgreed(next)}
          disabled={loading || saving}
        />
      </div>

      <label className="flex flex-col gap-2 text-sm font-semibold text-ink-soft">
        알림 시점
        <select
          value={daysBefore}
          disabled={!agreed || loading || saving}
          onChange={(event) => void changeDaysBefore(Number(event.target.value))}
          className="h-11 rounded-input border border-line bg-surface px-3 text-sm text-ink outline-none disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted sm:max-w-xs"
        >
          {NOTIFICATION_DAY_OPTIONS.map((day) => (
            <option key={day} value={day}>
              {day === 0 ? '소비기한 당일' : `소비기한 ${day}일 전`}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
