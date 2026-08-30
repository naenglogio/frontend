import type { RouteObject } from 'react-router';
import { RequireAuth } from '../components/RequireAuth';
// 페이지는 기존 barrel 유지 (직접 경로로 바꾸지 않음 — 팀 컨벤션)
import {
  MainPage,
  IngredientListPage,
  IngredientDetailPage,
  SearchMapPage,
  RecipeRecommendPage,
} from '../components/pages';

/**
 * 재성 담당 — 식재료/홈 라우트.
 * 새 라우트(상세/등록/스캔/3D 등)는 App.tsx가 아니라 이 파일에만 추가한다.
 */
export const ingredientRoutes: RouteObject[] = [
  { path: '/mainpage', element: <MainPage /> },
  {
    path: '/ingredients',
    element: (
      <RequireAuth>
        <IngredientListPage />
      </RequireAuth>
    ),
  },
  {
    path: '/ingredients/:id',
    element: (
      <RequireAuth>
        <IngredientDetailPage />
      </RequireAuth>
    ),
  },
  {
    path: '/searchmap',
    element: (
      <RequireAuth>
        <SearchMapPage />
      </RequireAuth>
    ),
  },
  {
    path: '/recipes',
    element: (
      <RequireAuth>
        <RecipeRecommendPage />
      </RequireAuth>
    ),
  },
  // 새 라우트(등록/스캔/3D 등)는 이 파일에만 추가한다.
];
