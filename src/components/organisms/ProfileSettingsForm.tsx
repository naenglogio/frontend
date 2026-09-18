import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Modal } from '../atoms/Modal';
import { ApiError } from '../../services/authApi';
import { changePassword, fetchProfile, updateNickname } from '../../services/profileApi';
import { clearAccessToken } from '../../utils/authToken';

const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/;

export function ProfileSettingsForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [nicknameSaving, setNicknameSaving] = useState(false);
  const [nicknameSaved, setNicknameSaved] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordPending, setPasswordPending] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    fetchProfile().then((profile) => {
      setEmail(profile.email);
      setNickname(profile.nickname);
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

  const saveNickname = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) return;
    setNicknameSaving(true);
    setNicknameSaved(false);
    try {
      await updateNickname(trimmed);
      setNickname(trimmed);
      setNicknameSaved(true);
    } finally {
      setNicknameSaving(false);
    }
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!currentPassword) nextErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
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
    } catch (error) {
      if (error instanceof ApiError && error.code === 'CURRENT_PASSWORD_MISMATCH') {
        setPasswordError('currentPassword', '현재 비밀번호를 다시 확인해주세요.');
      } else if (error instanceof ApiError && error.status === 401) {
        setPasswordError('currentPassword', '로그인이 만료됐어요. 다시 로그인해주세요.');
      } else if (error instanceof ApiError && error.status === 422) {
        setPasswordError('newPassword', '새 비밀번호 형식을 확인해주세요.');
      } else {
        setPasswordError('currentPassword', '비밀번호 변경에 실패했어요. 다시 시도해주세요.');
      }
    } finally {
      setPasswordPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <Input
          id="nickname"
          label="닉네임"
          value={nickname}
          maxLength={20}
          onChange={(event) => {
            setNickname(event.target.value);
            setNicknameSaved(false);
          }}
        />
        <Button type="button" variant="secondary" loading={nicknameSaving} onClick={() => void saveNickname()}>
          저장
        </Button>
      </div>
      {nicknameSaved && <p className="-mt-4 text-xs text-fresh">닉네임을 저장했어요.</p>}
      <Input id="email" label="이메일" value={email} disabled />

      <div className="border-t border-line pt-5">
        <p className="mb-3 text-sm font-semibold text-ink">비밀번호 변경</p>
        <form className="flex flex-col gap-4" onSubmit={handleChangePassword}>
          <Input
            id="currentPassword"
            type="password"
            label="현재 비밀번호"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value);
              clearPasswordError('currentPassword');
            }}
            error={passwordErrors.currentPassword}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="newPassword"
              type="password"
              label="새 비밀번호"
              placeholder="숫자·특수문자 포함"
              value={newPassword}
              onChange={(event) => {
                setNewPassword(event.target.value);
                clearPasswordError('newPassword');
              }}
              error={passwordErrors.newPassword}
            />
            <Input
              id="newPasswordConfirm"
              type="password"
              label="새 비밀번호 확인"
              value={newPasswordConfirm}
              onChange={(event) => setNewPasswordConfirm(event.target.value)}
              error={passwordErrors.newPasswordConfirm}
            />
          </div>
          {passwordSuccess && <p className="text-xs text-fresh">비밀번호가 변경됐어요.</p>}
          <Button type="submit" variant="secondary" loading={passwordPending} className="self-start">
            비밀번호 변경
          </Button>
        </form>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line pt-5">
        <div>
          <p className="text-sm font-semibold text-ink">로그아웃</p>
          <p className="mt-1 text-xs text-ink-muted">현재 기기에서 로그아웃합니다.</p>
        </div>
        <Button type="button" variant="secondary" onClick={() => setLogoutOpen(true)}>
          로그아웃
        </Button>
      </div>

      <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)}>
        <p className="text-center text-base font-bold text-ink">로그아웃하시겠어요?</p>
        <div className="mt-5 flex gap-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={() => setLogoutOpen(false)}>
            취소
          </Button>
          <Button
            type="button"
            className="flex-1"
            onClick={() => {
              clearAccessToken();
              navigate('/login', { replace: true });
            }}
          >
            로그아웃
          </Button>
        </div>
      </Modal>
    </div>
  );
}
