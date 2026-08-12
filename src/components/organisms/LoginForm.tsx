import { useState } from 'react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { ApiError, login } from '../../services/authApi';
import { setAccessToken } from '../../utils/authToken';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const nextErrors: Record<string, string> = {};
    if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = '올바른 이메일 형식이 아니에요.';
    }
    if (password.length < 1) {
      nextErrors.password = '비밀번호를 입력해주세요.';
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      const result = await login({ email, password });
      setAccessToken(result.access_token);
      onSuccess?.();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : '로그인에 실패했어요. 다시 시도해주세요.';
      setErrors({ password: message });
    } finally {
      setPending(false);
    }
  };

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <Input
        id="email"
        type="email"
        label="이메일"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        required
      />
      <Input
        id="password"
        type="password"
        label="비밀번호"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        required
      />
      <Button type="submit" loading={pending}>
        로그인
      </Button>
    </form>
  );
}
