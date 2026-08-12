import { useState } from 'react';
import { Link } from 'react-router';
import { FridgeIllustration } from '../atoms/FridgeIllustration';
import { LoginForm } from '../organisms/LoginForm';

export function LoginPage() {
  const [done, setDone] = useState(false);

  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <section className="flex flex-col items-center justify-center gap-3 bg-linear-to-br from-primary-500 to-primary-800 px-8 py-16 text-white md:w-2/5 md:py-0">
        <FridgeIllustration className="h-28 w-28" />
        <p className="text-3xl font-bold tracking-tight">Naenglog</p>
        <p className="max-w-xs text-center text-sm text-primary-50">
           잊혀진 재료들, 버려지기 전에 챙겨요 🥬
        </p>
      </section>

      <section className="flex flex-1 items-start justify-center bg-surface px-6 pt-10 pb-16 md:items-center md:py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-lg font-bold text-ink">로그인</h1>
          <p className="mt-1 text-sm text-ink-muted">이메일로 로그인하고 냉장고를 확인해보세요</p>
          <div className="mt-8">
            {done ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <p className="text-lg font-bold text-ink">로그인됐어요</p>
                <p className="text-sm text-ink-muted">냉로그를 시작해보세요.</p>
              </div>
            ) : (
              <LoginForm onSuccess={() => setDone(true)} />
            )}
          </div>
          {!done && (
            <p className="mt-6 text-center text-sm text-ink-muted">
              계정이 없으신가요?{' '}
              <Link
                to="/signup"
                className="font-semibold text-primary-600 hover:text-primary-700"
              >
                회원가입
              </Link>
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
