import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import {
  ApiError,
  confirmEmailVerification,
  requestEmailVerification,
  signup,
} from '../../services/authApi';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_PATTERN = /^\d{6}$/;
const PASSWORD_PATTERN = /^(?=.*[^A-Za-z0-9]).{8,72}$/;

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof ApiError ? error.message : fallback;

export interface SignupPayload {
  email: string;
  password: string;
  nickname: string;
}

export interface SignupFormProps {
  onRequestVerificationCode?: (email: string) => Promise<void>;
  onConfirmVerificationCode?: (email: string, code: string) => Promise<boolean>;
  onSignup?: (payload: SignupPayload) => Promise<void>;
}

type Step = 'email' | 'verify' | 'signup' | 'done';

export function SignupForm({
  onRequestVerificationCode = requestEmailVerification,
  onConfirmVerificationCode = confirmEmailVerification,
  onSignup = async (payload) => {
    await signup(payload);
  },
}: SignupFormProps) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setError = (field: string, message: string) =>
    setErrors((prev) => ({ ...prev, [field]: message }));
  const clearError = (field: string) =>
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

  const handleRequestCode = async () => {
    if (!EMAIL_PATTERN.test(email)) {
      setError('email', '올바른 이메일 형식이 아니에요.');
      return;
    }
    clearError('email');
    setPending(true);
    try {
      await onRequestVerificationCode(email);
      setStep('verify');
    } catch (error) {
      setError('email', errorMessage(error, '인증번호 전송에 실패했어요. 다시 시도해주세요.'));
    } finally {
      setPending(false);
    }
  };

  const handleConfirmCode = async () => {
    if (!CODE_PATTERN.test(code)) {
      setError('code', '6자리 숫자를 입력해주세요.');
      return;
    }
    clearError('code');
    setPending(true);
    try {
      const verified = await onConfirmVerificationCode(email, code);
      if (verified) {
        setStep('signup');
      } else {
        setError('code', '인증번호가 올바르지 않아요.');
      }
    } catch (error) {
      setError('code', errorMessage(error, '인증 확인에 실패했어요. 다시 시도해주세요.'));
    } finally {
      setPending(false);
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (!passwordConfirm) return;
    if (value !== passwordConfirm) {
      setError('passwordConfirm', '비밀번호가 일치하지 않아요.');
    } else {
      clearError('passwordConfirm');
    }
  };

  const handlePasswordConfirmChange = (value: string) => {
    setPasswordConfirm(value);
    if (!value) {
      clearError('passwordConfirm');
      return;
    }
    if (value !== password) {
      setError('passwordConfirm', '비밀번호가 일치하지 않아요.');
    } else {
      clearError('passwordConfirm');
    }
  };

  const handleSignup = async () => {
    const nextErrors: Record<string, string> = {};
    if (!PASSWORD_PATTERN.test(password)) {
      nextErrors.password = '8자 이상 72자 이하, 특수문자를 포함해 입력해주세요.';
    }
    if (passwordConfirm !== password) {
      nextErrors.passwordConfirm = '비밀번호가 일치하지 않아요.';
    }
    if (nickname.length < 1 || nickname.length > 20) {
      nextErrors.nickname = '1자 이상 20자 이하로 입력해주세요.';
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...nextErrors }));
      return;
    }
    setErrors({});
    setPending(true);
    try {
      await onSignup({ email, password, nickname });
      setStep('done');
    } catch (error) {
      setError('signup', errorMessage(error, '회원가입에 실패했어요. 다시 시도해주세요.'));
    } finally {
      setPending(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <p className="text-lg font-bold text-ink">가입이 완료됐어요</p>
        <p className="text-sm text-ink-muted">이제 로그인해서 냉로그를 시작해보세요.</p>
        <Link
          to="/login"
          className="mt-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          로그인하러 가기
        </Link>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        if (step === 'email') handleRequestCode();
        else if (step === 'verify') handleConfirmCode();
        else if (step === 'signup') handleSignup();
      }}
    >
      <div>
        <p className="mb-3 text-xs font-semibold tracking-wide text-primary-600">
          STEP 1 · 이메일 인증
        </p>
        <Input
          id="email"
          type="email"
          label="이메일"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          disabled={step !== 'email'}
          required
          action={
            step === 'email' && (
              <Button type="submit" className="shrink-0" loading={pending}>
                인증번호 받기
              </Button>
            )
          }
        />

        {(step === 'verify' || step === 'signup') && (
          <div className="mt-4">
            <Input
              id="code"
              inputMode="numeric"
              label="인증번호"
              placeholder="6자리 숫자"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={errors.code}
              disabled={step !== 'verify'}
              required
              action={
                step === 'verify' ? (
                  <Button type="submit" className="shrink-0" loading={pending}>
                    인증 확인
                  </Button>
                ) : (
                  <span className="shrink-0 text-xs font-medium text-fresh">인증 완료</span>
                )
              }
            />
          </div>
        )}
      </div>

      {step === 'signup' && (
        <div className="border-t border-line pt-5">
          <p className="mb-3 text-xs font-semibold tracking-wide text-primary-600">
            STEP 2 · 계정 정보
          </p>
          <div className="flex flex-col gap-4">
            <Input
              id="password"
              type="password"
              label="비밀번호"
              placeholder="8자 이상, 특수문자 포함"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              error={errors.password}
              required
            />
            <Input
              id="passwordConfirm"
              type="password"
              label="비밀번호 확인"
              value={passwordConfirm}
              onChange={(e) => handlePasswordConfirmChange(e.target.value)}
              error={errors.passwordConfirm}
              required
            />
            <Input
              id="nickname"
              label="닉네임"
              placeholder="1~20자"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              error={errors.nickname}
              required
            />
            {errors.signup && <p className="text-xs text-danger">{errors.signup}</p>}
            <Button type="submit" loading={pending}>
              가입하기
            </Button>
          </div>
        </div>
      )}
    </form>
  );
}
