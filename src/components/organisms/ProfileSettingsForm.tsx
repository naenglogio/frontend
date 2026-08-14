import { useEffect, useState } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Modal } from '../atoms/Modal';
import { ToggleSwitch } from '../atoms/ToggleSwitch';
import { changePassword, fetchProfile, updateNotificationPreference } from '../../services/profileApi';

const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/;

function BellIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 3.5 1 5.5 2 7H4c1-1.5 2-3.5 2-7Z" />
      <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
    </svg>
  );
}

export function ProfileSettingsForm() {
  const [email, setEmail] = useState('');
  const [notificationAgreed, setNotificationAgreed] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [notificationSaving, setNotificationSaving] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordPending, setPasswordPending] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    fetchProfile().then((profile) => {
      setEmail(profile.email);
      setNotificationAgreed(profile.notificationAgreed);
      setProfileLoading(false);
    });
  }, []);

  const setPasswordError = (field: string, message: string) =>
    setPasswordErrors((prev) => ({ ...prev, [field]: message }));
  const clearPasswordError = (field: string) =>
    setPasswordErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const applyNotificationChange = async (checked: boolean) => {
    setNotificationAgreed(checked);
    setNotificationSaving(true);
    try {
      await updateNotificationPreference(checked);
    } finally {
      setNotificationSaving(false);
    }
  };

  const handleToggleRequest = (next: boolean) => {
    if (next) {
      setConfirmOpen(true);
    } else {
      applyNotificationChange(false);
    }
  };

  const handleConfirmEnable = () => {
    setConfirmOpen(false);
    applyNotificationChange(true);
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    if (!newPasswordConfirm) return;
    if (value !== newPasswordConfirm) {
      setPasswordError('newPasswordConfirm', '비밀번호가 일치하지 않아요.');
    } else {
      clearPasswordError('newPasswordConfirm');
    }
  };

  const handleNewPasswordConfirmChange = (value: string) => {
    setNewPasswordConfirm(value);
    if (!value) {
      clearPasswordError('newPasswordConfirm');
      return;
    }
    if (value !== newPassword) {
      setPasswordError('newPasswordConfirm', '비밀번호가 일치하지 않아요.');
    } else {
      clearPasswordError('newPasswordConfirm');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!currentPassword) {
      nextErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
    }
    if (!PASSWORD_PATTERN.test(newPassword)) {
      nextErrors.newPassword = '8자 이상 72자 이하, 숫자와 특수문자를 포함해 입력해주세요.';
    }
    if (newPasswordConfirm !== newPassword) {
      nextErrors.newPasswordConfirm = '비밀번호가 일치하지 않아요.';
    }
    if (Object.keys(nextErrors).length > 0) {
      setPasswordErrors(nextErrors);
      return;
    }
    setPasswordErrors({});
    setPasswordPending(true);
    setPasswordSuccess(false);
    try {
      await changePassword({ currentPassword, newPassword });
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
    } catch {
      setPasswordError('currentPassword', '비밀번호 변경에 실패했어요. 다시 시도해주세요.');
    } finally {
      setPasswordPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3 rounded-input bg-primary-50 p-4">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              notificationAgreed ? 'bg-primary-500 text-white' : 'bg-primary-100 text-primary-600'
            }`}
          >
            <BellIcon active={notificationAgreed} />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">유통기한 알림</p>
            <p className="text-xs text-ink-muted">재료가 상하기 전에 알려드릴게요</p>
          </div>
        </div>
        <ToggleSwitch
          id="notificationAgreed"
          checked={notificationAgreed}
          onChange={handleToggleRequest}
          disabled={profileLoading || notificationSaving}
        />
      </div>

      <Input id="email" label="이메일" value={email} disabled />

      <div className="border-t border-line pt-5">
        <p className="mb-3 text-sm font-semibold text-ink">비밀번호 변경</p>
        <form className="flex flex-col gap-4" onSubmit={handleChangePassword}>
          <Input
            id="currentPassword"
            type="password"
            label="현재 비밀번호"
            value={currentPassword}
            onChange={(e) => {
              setCurrentPassword(e.target.value);
              clearPasswordError('currentPassword');
            }}
            error={passwordErrors.currentPassword}
          />
          <Input
            id="newPassword"
            type="password"
            label="새 비밀번호"
            placeholder="8자 이상, 숫자·특수문자 포함"
            value={newPassword}
            onChange={(e) => handleNewPasswordChange(e.target.value)}
            error={passwordErrors.newPassword}
          />
          <Input
            id="newPasswordConfirm"
            type="password"
            label="새 비밀번호 확인"
            value={newPasswordConfirm}
            onChange={(e) => handleNewPasswordConfirmChange(e.target.value)}
            error={passwordErrors.newPasswordConfirm}
          />
          {passwordSuccess && <p className="text-xs text-fresh">비밀번호가 변경됐어요.</p>}
          <Button type="submit" variant="secondary" loading={passwordPending} className="self-start">
            비밀번호 변경
          </Button>
        </form>
      </div>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <BellIcon active />
          </span>
          <p className="text-base font-bold text-ink">알림을 받으시겠어요?</p>
          <p className="text-sm text-ink-muted">
            유통기한이 임박한 재료가 있으면 <br /> 재료가 상하기 전에 알려드릴게요.
          </p>
        </div>
        <div className="mt-5 flex gap-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => setConfirmOpen(false)}
          >
            취소
          </Button>
          <Button type="button" className="flex-1" onClick={handleConfirmEnable}>
            확인
          </Button>
        </div>
      </Modal>
    </div>
  );
}
