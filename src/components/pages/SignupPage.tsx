import { Link } from 'react-router';
import { FridgeIllustration } from '../atoms/FridgeIllustration';
import { SignupForm } from '../organisms/SignupForm';

export function SignupPage() {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <section className="flex flex-col items-center justify-center gap-3 bg-linear-to-br from-primary-500 to-primary-800 px-8 py-16 text-white md:w-2/5 md:py-0">
        <FridgeIllustration className="h-28 w-28" />
        <p className="text-3xl font-bold tracking-tight">Naenglog</p>
        <p className="max-w-xs text-center text-sm text-primary-50">
          냉장고 파먹기, 냉로그와 함께 시작해요 🥕
        </p>
      </section>

      <section className="flex flex-1 items-start justify-center bg-surface px-6 pt-10 pb-16 md:items-center md:py-12">
        <div className="w-full max-w-sm">
          <h1 className="text-lg font-bold text-ink">회원가입</h1>
          <p className="mt-1 text-sm text-ink-muted">이메일로 간편하게 시작해보세요</p>
          <div className="mt-8">
            <SignupForm />
          </div>
          <p className="mt-6 text-center text-sm text-ink-muted">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
              로그인
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
