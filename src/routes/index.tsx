import type { RouteObject } from 'react-router';
import { authRoutes } from './auth.routes';
import { ingredientRoutes } from './ingredient.routes';
import { userRoutes } from './user.routes';

/**
 * 앱 전체 라우트 합본.
 * 도메인별 *.routes.tsx 만 수정하고, 이 파일은 보통 손대지 않는다.
 */
export const routes: RouteObject[] = [
  ...authRoutes,
  ...ingredientRoutes,
  ...userRoutes,
];
