// 기능: 식재료 상세 화면 (재성)
// GET /api/v1/ingredients/{id}
// 노션: ingredients, products, product_freshness_profiles 참조 (실물값 + 시스템 참고값)
import type { Ingredient } from '../models/ingredient';
import type { Product } from '../models/product';
import type { ProductFreshnessProfile } from '../models/productFreshnessProfile';

// 상세 응답: 식재료 본체 + (상품 기반 등록 시) 참고 상품/소비기한 프로필.
// 직접 입력 식재료는 product/freshness_profile이 null.
export interface IngredientDetailResponse extends Ingredient {
  product: Product | null;
  freshness_profile: ProductFreshnessProfile | null;
}
