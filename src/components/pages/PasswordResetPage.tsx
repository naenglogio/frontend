import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../atoms/Button';
import { FridgeIllustration } from '../atoms/FridgeIllustration';
import { Input } from '../atoms/Input';
import {
  ApiError,
  completePasswordReset,
  confirmPasswordReset,
  requestPasswordReset,
} from '../../services/authApi';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*\d)(?=.*[^A-Za-z0-9]).{8,72}$/;
const CODE_LENGTH = 6;
const CODE_EXPIRES_IN = 5 * 60;
const RESEND_DELAY = 60;

type Step = 'email' | 'verify' | 'password' | 'done';

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof ApiError ? error.message : fallback;

const formatTime = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

export function PasswordResetPage() {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [expiresIn, setExpiresIn] = useState(CODE_EXPIRES_IN);
  const [resendIn, setResendIn] = useState(RESEND_DELAY);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const codeRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (step !== 'verify') return;
    const timer = window.setInterval(() => {
      setExpiresIn((value) => Math.max(0, value - 1));
      setResendIn((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [step]);

  const sendCode = async (isResend = false) => {
    if (!EMAIL_PATTERN.test(email)) {
      setError('올바른 이메일 형식이 아니에요.');
      return;
    }
    setError('');
    setPending(true);
    try {
      await requestPasswordReset(email);
      setCode(Array(CODE_LENGTH).fill(''));
      setExpiresIn(CODE_EXPIRES_IN);
      setResendIn(RESEND_DELAY);
      setStep('verify');
      window.setTimeout(() => codeRefs.current[0]?.focus(), 0);
    } catch (requestError) {
      setError(
        getErrorMessage(
          requestError,
          isResend ? '인증번호 재전송에 실패했어요.' : '인증번호 전송에 실패했어요.',
        ),
      );
    } finally {
      setPending(false);
    }
  };

  const updateCode = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    setCode((current) => current.map((item, itemIndex) => (itemIndex === index ? digit : item)));
    setError('');
    if (digit && index < CODE_LENGTH - 1) codeRefs.current[index + 1]?.focus();
  };

  const handleCodePaste = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, CODE_LENGTH).split('');
    if (!digits.length) return;
    setCode(Array.from({ length: CODE_LENGTH }, (_, index) => digits[index] ?? ''));
    codeRefs.current[Math.min(digits.length, CODE_LENGTH) - 1]?.focus();
  };

  const verifyCode = async () => {
    const joinedCode = code.join('');
    if (expiresIn === 0) {
      setError('인증번호가 만료됐어요. 새 인증번호를 받아주세요.');
      return;
    }
    if (!/^\d{6}$/.test(joinedCode)) {
      setError('6자리 인증번호를 모두 입력해주세요.');
      return;
    }
    setError('');
    setPending(true);
    try {
      const verified = await confirmPasswordReset(email, joinedCode);
      if (!verified) {
        setError('인증번호가 올바르지 않아요.');
        return;
      }
      setStep('password');
    } catch (confirmError) {
      setError(getErrorMessage(confirmError, '인증번호 확인에 실패했어요.'));
    } finally {
      setPending(false);
    }
  };

  const savePassword = async () => {
    if (!PASSWORD_PATTERN.test(password)) {
      setError('비밀번호는 8~72자이며 숫자와 특수문자를 포함해야 해요.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않아요.');
      return;
    }
    setError('');
    setPending(true);
    try {
      await completePasswordReset({ email, new_password: password });
      setStep('done');
    } catch (completeError) {
      setError(getErrorMessage(completeError, '비밀번호 변경에 실패했어요.'));
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <section className="flex flex-col items-center justify-center gap-3 bg-linear-to-br from-primary-500 to-primary-800 px-8 py-16 text-white md:w-2/5 md:py-0">
        <FridgeIllustration className="h-28 w-28" />
        <p className="text-3xl font-bold tracking-tight">Naenglog</p>
        <p className="max-w-xs text-center text-sm text-primary-50">
          다시 냉장고를 기록할 수 있도록 도와드릴게요 🥬
        </p>
      </section>

      <section className="flex flex-1 items-start justify-center bg-surface px-6 pt-10 pb-16 md:items-center md:py-12">
        <div className="w-full max-w-sm">
          {step !== 'done' && (
            <>
              <p className="text-xs font-semibold tracking-wide text-primary-600">
                {step === 'email' ? 'STEP 1 · 이메일 확인' : step === 'verify' ? 'STEP 2 · 인증번호 확인' : 'STEP 3 · 새 비밀번호'}
              </p>
              <h1 className="mt-2 text-lg font-bold text-ink">비밀번호 재설정</h1>
              <p className="mt-1 text-sm text-ink-muted">
                {step === 'email' && '가입할 때 사용한 이메일을 입력해주세요.'}
                {step === 'verify' && `${email}으로 전송된 6자리 번호를 입력해주세요.`}
                {step === 'password' && '앞으로 사용할 새로운 비밀번호를 입력해주세요.'}
              </p>
            </>
          )}

          <div className={step === 'done' ? '' : 'mt-8'}>
            {step === 'email' && (
              <form onSubmit={(event) => { event.preventDefault(); void sendCode(); }}>
                <Input
                  id="reset-email"
                  type="email"
                  label="이메일"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => { setEmail(event.target.value); setError(''); }}
                  error={error}
                  required
                  action={<Button type="submit" className="shrink-0" loading={pending}>인증번호 받기</Button>}
                />
              </form>
            )}

            {step === 'verify' && (
              <form onSubmit={(event) => { event.preventDefault(); void verifyCode(); }}>
                <label className="text-sm font-medium text-ink-soft">인증번호</label>
                <div className="mt-2 flex gap-2" onPaste={(event) => { event.preventDefault(); handleCodePaste(event.clipboardData.getData('text')); }}>
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => { codeRefs.current[index] = element; }}
                      aria-label={`인증번호 ${index + 1}번째 자리`}
                      inputMode="numeric"
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      maxLength={1}
                      value={digit}
                      onChange={(event) => updateCode(index, event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Backspace' && !digit && index > 0) codeRefs.current[index - 1]?.focus();
                      }}
                      className="min-w-0 flex-1 rounded-input border border-line bg-surface px-0 py-3 text-center text-lg font-semibold text-ink outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    />
                  ))}
                </div>
                <p className={`mt-3 text-center text-sm font-medium ${expiresIn === 0 ? 'text-danger' : 'text-primary-600'}`}>
                  남은 시간 {formatTime(expiresIn)}
                </p>
                {error && <p className="mt-2 text-xs text-danger">{error}</p>}
                <Button type="submit" className="mt-5 w-full" loading={pending}>인증번호 확인</Button>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-ink-muted">
                  <span>인증번호를 받지 못했나요?</span>
                  <button
                    type="button"
                    disabled={resendIn > 0 || pending}
                    onClick={() => void sendCode(true)}
                    className="font-semibold text-primary-600 disabled:cursor-not-allowed disabled:text-ink-muted"
                  >
                    재전송 {resendIn > 0 && formatTime(resendIn)}
                  </button>
                </div>
              </form>
            )}

            {step === 'password' && (
              <form className="flex flex-col gap-5" onSubmit={(event) => { event.preventDefault(); void savePassword(); }}>
                <Input id="new-password" type="password" label="새 비밀번호" placeholder="8자 이상, 숫자·특수문자 포함" value={password} onChange={(event) => { setPassword(event.target.value); setError(''); }} required />
                <Input id="new-password-confirm" type="password" label="새 비밀번호 확인" placeholder="비밀번호를 한 번 더 입력해주세요" value={passwordConfirm} onChange={(event) => { setPasswordConfirm(event.target.value); setError(''); }} error={error} required />
                <Button type="submit" loading={pending}>비밀번호 변경</Button>
              </form>
            )}

            {step === 'done' && (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-2xl text-primary-600">✓</div>
                <p className="text-lg font-bold text-ink">비밀번호가 변경됐어요</p>
                <p className="text-sm text-ink-muted">새 비밀번호로 로그인해주세요.</p>
                <Link to="/login" className="mt-4 w-full rounded-input bg-primary-500 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-600">로그인하러 가기</Link>
              </div>
            )}
          </div>

          {step !== 'done' && (
            <p className="mt-6 text-center text-sm text-ink-muted">
              비밀번호가 기억났나요?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">로그인</Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
