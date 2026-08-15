// 기능: 메인 3D 냉장고 + 대시보드 집계 (재성)
import type { Ingredient } from '../models/ingredient';
import type { StorageType } from '../models/enums';

// ── 대시보드 집계 ──
// GET /api/v1/ingredients/summary
// MainPage의 StatStrip / FridgeCard / ExpiringCard가 사용.
export interface IngredientSummaryResponse {
  total: number; // 전체 보유 수 (is_deleted=false)
  refrigerated_count: number; // storage_type=0
  frozen_count: number; // storage_type=1
  expiring_count: number; // 임박 기준(D-day) 이내 개수
  expiring_items: ExpiringItem[]; // 임박 목록 top N
}

export interface ExpiringItem {
  id: number;
  name: string;
  storage_type: StorageType;
  expiration_date: string | null;
}

// ── 3D 냉장고 렌더링 ──
// 3D 씬은 GET /ingredients (소유분, is_deleted=false)를 그대로 소비한다.
// 배치 좌표는 프론트에서 storage_type 기준으로 계산하므로 별도 API 필드는 두지 않는다.
// (서버 좌표가 필요해지면 아래 타입을 확장한다.)
export type Fridge3DItem = Ingredient;
