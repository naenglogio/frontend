// 기능: 식재료 등록 화면 (재성)
// POST /api/v1/ingredients
import type { Ingredient } from '../models/ingredient';
import type { ExpirationSource, StorageType } from '../models/enums';

// 등록 요청. 서버가 채우는 값(id, user_id, status 기본값, created_at 등)은 제외.
// expiration_source/status는 서버 default(USER_INPUT/CONFIRMED)를 쓰되,
// 클라이언트가 명시할 수도 있어 optional로 둔다.
export interface IngredientCreateRequest {
  food_id: number;
  product_id?: number | null;
  freshness_profile_id?: number | null;
  name: string;
  storage_type: StorageType; // 0: 냉장, 1: 냉동
  quantity: number;
  unit?: string | null;
  purchase_date?: string | null;
  expiration_date?: string | null;
  expiration_source?: ExpirationSource;
  image_url?: string | null;
  memo?: string | null;
}

// 등록 응답은 생성된 식재료 본체.
export type IngredientCreateResponse = Ingredient;
