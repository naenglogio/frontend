import type { RouteObject } from 'react-router';
import { RequireAuth } from '../components/RequireAuth';
// 페이지는 기존 barrel 유지 (직접 경로로 바꾸지 않음 — 팀 컨벤션)
import { ProfilePage } from '../components/pages';

/** 사용자/프로필 도메인 라우트 */
export const userRoutes: RouteObject[] = [
  {
    path: '/profile',
    element: (
      <RequireAuth>
        <ProfilePage />
      </RequireAuth>
    ),
  },
];
