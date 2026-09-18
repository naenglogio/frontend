import type { RouteObject } from 'react-router';
import { RequireAuth } from '../components/RequireAuth';
// 페이지는 기존 barrel 유지 (직접 경로로 바꾸지 않음 — 팀 컨벤션 / merge 규칙)
import {
  MainPage,
  IngredientListPage,
  IngredientCreatePage,
  IngredientDetailPage,
  RecognizePage,
  SearchMapPage,
  RecipeRecommendPage,
} from '../components/pages';

/**
 * 재성 담당 — 식재료/홈 도메인 라우트.
 * 새 페이지는 App.tsx 가 아니라 이 파일에만 추가한다. (routing_and_merge rule)
 *
 * 정적 경로 순서 주의:
 * `/ingredients/new`, `/ingredients/recognize` 를 `/ingredients/:id` 보다 위에 둬야
 * "new"/"recognize" 가 id 로 매칭되지 않는다.
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
    // FE-3 직접 등록
    path: '/ingredients/new',
    element: (
      <RequireAuth>
        <IngredientCreatePage />
      </RequireAuth>
    ),
  },
  {
    // FE-4 스캔(바코드/영수증/사진). 화면 확인 중에는 RequireAuth 생략 — 확인 후 가드 추가
    path: '/ingredients/recognize',
    element: <RecognizePage />,
  },
  {
    // FE-2 상세 (:id 는 정적 경로들보다 아래)
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
  // 새 라우트(3D 등)는 이 파일에만 추가한다.
];
