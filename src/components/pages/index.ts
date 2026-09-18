// pages barrel — 한 줄 = 한 export (merge=union 대상).
// 새 페이지 export 추가 시 알파벳 순을 유지하면 충돌·중복을 줄일 수 있다.
export { IngredientCreatePage } from './IngredientCreatePage';
export type { IngredientCreatePrefill } from './IngredientCreatePage';
export { IngredientDetailPage } from './IngredientDetailPage';
export { IngredientListPage } from './IngredientListPage';
export { LoginPage } from './LoginPage';
export { MainPage } from './MainPage';
export { ProfilePage } from './ProfilePage';
export { RecipeRecommendPage } from './RecipeRecommendPage';
// FE-4 스캔/인식 화면
export { RecognizePage } from './RecognizePage';
export { SearchMapPage } from './SearchMapPage';
export { SignupPage } from './SignupPage';
