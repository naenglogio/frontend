// 노션 ERD #7 ingredients (사용자 냉장고 식재료)
// 재성 담당 화면(상세/등록/3D 냉장고)의 핵심 모델.
import type {
  DeletionReason,
  ExpirationSource,
  ExpirationStatus,
  StorageType,
} from './enums';

export interface Ingredient {
  id: number;
  user_id: number;
  food_id: number;
  // 컬리 상품 기반 등록 시에만 값이 있다. 직접 입력이면 null.
  product_id: number | null;
  freshness_profile_id: number | null;
  name: string;
  storage_type: StorageType; // 0: 냉장, 1: 냉동
  quantity: number;
  unit: string | null; // 개, 봉지, 팩, 병 등
  purchase_date: string | null; // 실제 구매일 (date)
  expiration_date: string | null; // 실물의 소비기한 날짜 (date)
  expiration_source: ExpirationSource;
  expiration_status: ExpirationStatus;
  is_deleted: boolean;
  // is_deleted=false면 null, true면 사유가 있다.
  deletion_reason: DeletionReason | null;
  image_url: string | null;
  memo: string | null;
  created_at: string;
  updated_at: string | null;
}
