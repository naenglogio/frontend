# 2026-08-15 개발 이력 (FE-0 타입 재배치)

## 배경 / 목적
- 문서(`09_fe_types_setup.md`, `00_README.md`) 기준 구조는 `types/models/`, `types/features/`, `utils/storage.ts`다.
- 레포에는 타입이 **평면(flat)** 으로 `src/types/`에 들어와 있었고, `src/types/index.ts`가 노션 모델 배럴로 **덮어써져** 선영·우희 화면이 깨질 수 있는 상태였다.
- FE-0을 **재배치 방식**으로 정리했다. 파일 내용은 그대로 두고 위치·배럴·alias·원복만 수행.

## 한 일

### 1. 폴더 재배치 (`git mv`)
모델 → `src/types/models/`
- `enums.ts`, `user.ts`, `userDevice.ts`, `category.ts`, `food.ts`
- `product.ts`, `productFreshnessProfile.ts`, `ingredient.ts`, `notification.ts`

기능 → `src/types/features/`
- `common.ts`, `ingredientDetail.ts`, `ingredientRegister.ts`
- `cameraRecognize.ts`, `fridge.ts`

유틸 → `src/utils/storage.ts`
- 기존 `src/types/storage.ts`를 이동 (storage_type int 0/1 ↔ 한글 라벨)

**이유:** feature/model 파일의 import(`./enums`, `../models/...`, `../types/models/enums`)가 이 구조를 전제로 작성되어 있었기 때문. 이동 후 import 경로를 점검했고 추가 수정 없이 일치했다.

### 2. 배럴 파일 생성
- `src/types/models/index.ts` — 9개 모델 + enums re-export
- `src/types/features/index.ts` — 5개 기능 re-export

**이유:** `@/types/models`, `@/types/features`로 한 곳에서 import하기 위한 공개 API.

### 3. 옛 `src/types/index.ts` 원복
선영·우희용 옛 스키마로 되돌림:
- `StorageType = 'fridge' | 'freezer'`
- `Ingredient` (`expiryDate`, `quantityGrams`, `storageType` 등)

**이유:** `IngredientCard`, `IngredientListPage`, `mocks/ingredients.ts` 등이 `from '../../types'`로 이 스키마를 사용한다. 노션 ERD 타입과 공존하되 **이 파일은 건드리지 않는 것**이 팀 규칙이다.

### 4. `@/` 경로 별칭 추가
- `tsconfig.app.json` / `tsconfig.json`: `"@/*": ["./src/*"]`
  - TypeScript 6에서 `baseUrl`이 deprecated라 **paths에 `./src` prefix만** 사용 (baseUrl 미사용)
- `vite.config.ts`: `resolve.alias['@'] = path.resolve(__dirname, 'src')`

**이유:** 문서·README 예시(`@/types/models` 등)와 실제 빌드/번들러 해석을 맞추기 위함.

### 5. 검증
- `yarn build` (`tsc -b && vite build`) → **성공 (에러 0)**
- 옛 index를 쓰는 Ingredient 목록 화면 타입이 빌드에 포함되어 통과 확인

## 하지 않은 일 (범위 밖)
- FE-1 `ingredientApi.ts`는 이번 재배치 범위에 포함하지 않음 (후속 작업)
- 타입 파일 **내용** 신규 작성/수정 없음 (이동·배럴·원복·alias만)

## 결과 체크
| 항목 | 결과 |
|------|------|
| models/features/utils 구조 | ✅ |
| 내부 import 경로 | ✅ (추가 수정 불필요) |
| 옛 `types/index.ts` 원복 | ✅ |
| `@/` alias | ✅ |
| `yarn build` | ✅ |
