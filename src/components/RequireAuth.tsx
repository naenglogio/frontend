import type { ReactNode } from 'react';
import { Navigate } from 'react-router';
import { getAccessToken } from '../utils/authToken';

// 로그인 필요한 라우트를 감싸는 가드. App.tsx에서 로그인 후에만 보여야 하는
// <Route element>를 <RequireAuth>로 감싸서 사용 (예: /profile 라우트 참고)
export function RequireAuth({ children }: { children: ReactNode }) {
  if (!getAccessToken()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
