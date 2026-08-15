# NaengLog 프론트 타입 정의 (노션 ERD 정본 기준)

노션 ERD를 단일 정본으로 삼아 정의한 프론트엔드 타입입니다.
기존 `types/index.ts`(옛 스키마)는 건드리지 않으므로, 이 파일들을 추가해도
선영·우희 화면 빌드는 깨지지 않습니다.

## 구조

```
types/
├─ models/                        ← 노션 ERD 8개 테이블 (1:1)
│  ├─ enums.ts                      공유 enum (StorageType 등, 값은 노션 정본)
│  ├─ user.ts                       #1 users
│  ├─ userDevice.ts                 #2 user_devices
│  ├─ category.ts                   #3 categories
│  ├─ food.ts                       #4 foods
│  ├─ product.ts                    #5 products
│  ├─ productFreshnessProfile.ts    #6 product_freshness_profiles
│  ├─ ingredient.ts                 #7 ingredients (재성 담당 핵심)
│  ├─ notification.ts               #8 notifications
│  └─ index.ts                      배럴
└─ features/                      ← 재성 담당 기능별 요청/응답
   ├─ common.ts                     Page<T>, ErrorResponse (백엔드 schemas.py와 일치)
   ├─ ingredientDetail.ts           상세 화면
   ├─ ingredientRegister.ts         등록 화면
   ├─ cameraRecognize.ts            카메라 인식
   ├─ fridge.ts                     3D 냉장고 + 대시보드 집계
   └─ index.ts                      배럴
utils/
└─ storage.ts                     storage_type(int) ↔ 한글 라벨 매핑
```

## 원칙

- **정본 = 노션 ERD.** 모든 필드명·타입·enum 값은 노션 문서 기준.
- **storage_type은 int** (0: 냉장, 1: 냉동). 화면 표시만 `utils/storage.ts`로 한글 변환.
- **models = DB 스키마와 1:1**, **features = 화면 API 요청/응답**. 관심사 분리.
- 백엔드 응답은 snake_case이므로 필드도 snake_case로 정의.

## 사용 예

```ts
import type { Ingredient, StorageType } from '@/types/models';
import type { IngredientCreateRequest, IngredientDetailResponse } from '@/types/features';
import { storageLabel, STORAGE_OPTIONS } from '@/utils/storage';
```

## 팀 전환 안내

기존 `types/index.ts`의 옛 `Ingredient`(expiryDate, quantityGrams, storageType='fridge' 등)는
그대로 남아 있습니다. 각 담당자가 노션 기준으로 옮겨온 뒤 삭제하세요.
검증: `npx tsc --noEmit`가 통과하는 상태로 커밋 (전체 빌드 무결).
