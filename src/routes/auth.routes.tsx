import { Navigate } from 'react-router';
import type { RouteObject } from 'react-router';
// 페이지는 기존 barrel 유지 (직접 경로로 바꾸지 않음 — 팀 컨벤션)
import { LoginPage, SignupPage } from '../components/pages';

/** 인증·온보딩 라우트: 루트 리다이렉트 + 로그인/회원가입 */
export const authRoutes: RouteObject[] = [
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },
];
