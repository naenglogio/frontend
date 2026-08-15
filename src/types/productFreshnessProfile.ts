// 노션 ERD #6 product_freshness_profiles (최종 소비기한 프로필)
import type {
  MatchLevel,
  ShelfLifeSource,
  ShelfLifeStatus,
  StorageType,
} from './enums';

export interface ProductFreshnessProfile {
  id: number;
  product_id: number;
  storage_type: StorageType;
  // 날짜가 아니라 기준일로부터의 '일수'다 (노션 7항).
  shelf_life_days: number;
  shelf_life_source: ShelfLifeSource;
  shelf_life_status: ShelfLifeStatus;
  confidence_score: number | null;
  match_level: MatchLevel | null;
  normalizer_version: string;
  reference_version: string;
  created_at: string;
  updated_at: string | null;
}
