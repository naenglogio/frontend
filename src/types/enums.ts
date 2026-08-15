// 노션 ERD 정본 기준 공유 enum 정의
// 값과 의미는 모두 노션 ERD 문서를 단일 정본으로 삼는다.

// ── ingredients / product_freshness_profiles 공유 ──

// 보관방법. DB/노션 정본은 정수(int)다.
// 0: 냉장, 1: 냉동
export const StorageType = {
  REFRIGERATED: 0,
  FROZEN: 1,
} as const;
export type StorageType = (typeof StorageType)[keyof typeof StorageType];

// 소비기한 값의 출처.
export type ExpirationSource =
  | 'USER_INPUT'
  | 'PACKAGE_OCR'
  | 'PRODUCT_DISCLOSURE'
  | 'MFDS_REFERENCE';

// 사용자 식재료(ingredients)의 소비기한 상태.
// 노션: CONFIRMED / ESTIMATED / REVIEW_REQUIRED
export type ExpirationStatus = 'CONFIRMED' | 'ESTIMATED' | 'REVIEW_REQUIRED';

// 논리 삭제 사유. is_deleted=true일 때만 값을 가진다.
export type DeletionReason = 'CONSUMED' | 'DISCARDED' | 'INCORRECT_ENTRY';

// ── product_freshness_profiles 전용 ──

// 최종 소비기한 값의 출처.
export type ShelfLifeSource = 'PRODUCT_DISCLOSURE' | 'MFDS_REFERENCE' | 'MANUAL';

// product_freshness_profiles의 최종값 상태.
// 노션: 프로필은 CONFIRMED / ESTIMATED 두 값만 적재된다.
export type ShelfLifeStatus = 'CONFIRMED' | 'ESTIMATED';

// 식약처 기준 매칭 수준.
export type MatchLevel = 'FINE' | 'COARSE' | 'MANUAL';

// ── users / user_devices ──

// 회원 상태. 0: 활성, 1: 탈퇴
export const UserStatus = {
  ACTIVE: 0,
  WITHDRAWN: 1,
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

// 접근 권한. 0: 사용자, 1: 관리자
export const UserRole = {
  USER: 0,
  ADMIN: 1,
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// 디바이스 플랫폼.
export type DevicePlatform = 'ANDROID' | 'IOS' | 'WEB';

// ── products ──

// 외부 상품 출처.
export type SourceSite = 'KURLY_N_MART';
