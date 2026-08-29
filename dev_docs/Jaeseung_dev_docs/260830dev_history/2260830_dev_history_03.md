# 2026-08-30 개발 기록 — FE-2 (상세 화면)

- 브랜치: `mainpage`
- 테스크: FE-2 (식재료 상세 화면)
- 기준 문서: `frontend/20_fe_detail_page.md`, `shared/00_API_CONTRACT.md`(1. 상세), `shared/02_DESIGN_SYSTEM.md`
- 선행: FE-1(API 클라이언트) 완료, BE-3(목록/상세 API) 완료 상태에서 실연동으로 시작

## 목적

`/ingredients/:id` 라우트를 신설해 `getIngredient(id)`로 실서버 상세를 조회하고,
와이어프레임("식재료 상세 / 편집") 레이아웃대로 화면을 채운다.

## 한 일

### 1. `src/components/atoms/ExpiryTag.tsx` 신규

기존 `DDayTag`는 `mock/home`의 `DDay`(0/1/3 리터럴)에 묶여 있어 실제
`expiration_date`를 못 받는다(`02_DESIGN_SYSTEM.md` 명시 주의사항).
→ 기존 파일을 건드리지 않고 신규 atom으로 분리. `utils/dday.ts`의
`getDdayInfo`(이미 임의 날짜 문자열을 받는 범용 버전)로 D-day 배지를 만들고,
`expiration_status === 'ESTIMATED'`일 때 "예상" 배지를 추가로 붙인다.

### 2. `src/components/pages/IngredientDetailPage.tsx` 신규

- `useParams`로 id 파싱 → `getIngredient(id)` 호출. 로딩 스피너 → 성공 시 상세,
  `ApiError.status===404`면 404 화면, 그 외 에러는 재시도 안내 메시지.
- 레이아웃(위→아래): 뒤로가기+타이틀 → 이미지(없으면 placeholder) → 이름 →
  저장위치 `SegmentedControl`(냉장/냉동 2종) → 수량 스테퍼(-/+) → 유통기한
  (날짜 + `ExpiryTag`, `expiration_status`/지남 여부에 따라 카드 테두리색 danger/warning
  분기) → 참고 상품(product 있을 때만, product/freshness_profile 표시) → 메모 →
  하단 저장(primary, full-width)/삭제(danger 텍스트) 버튼.
- 저장위치·수량은 화면에서 바로 편집 가능한 컨트롤로 두되(체크포인트: 스테퍼 동작,
  2탭 SegmentedControl 동작), **PATCH/DELETE 엔드포인트가 계약서에 아직 없어**
  실제 서버 반영은 하지 않는다. 저장/삭제 버튼은 동작은 하되(삭제는 `Modal` 확인창까지)
  "백엔드 API 확정 후 연동 예정" 안내만 띄우고 끝냄 — 성공한 것처럼 속이지 않음.
  `TODO(BE):` 주석으로 표시.

### 3. 라우팅

- `src/routes/ingredient.routes.tsx`에 `/ingredients/:id`를 `RequireAuth`로
  감싸 추가. `src/components/pages/index.ts` 배럴에 export 추가.

### 4. UI 컨벤션 재사용 확인

기존 구현 화면(`IngredientListPage`, `MainPage`, `ProfilePage`, `LoginPage`)과
컨셉을 맞추기 위해 새로 만들지 않고 그대로 가져다 쓴 것:
`atoms/Button`, `atoms/Badge`, `atoms/Modal`, `atoms/SegmentedControl`,
`utils/dday.ts`, `utils/storage.ts`(`storageLabel`/`STORAGE_OPTIONS`),
디자인 토큰(`rounded-card`/`rounded-input`/`shadow-soft`/`bg-surface-muted`
등, 임의 색상 없음). `SegmentedControl`은 `T extends string` 제네릭이라
`storage_type`(int) ↔ 문자열 매핑만 페이지 레벨에서 처리.

## 검증

- `npm run lint` — clean
- `npx tsc -b`(=`npm run build`에 포함) — clean, `vite build` 성공
- 수동 스모크는 미실시(백엔드 로컬 서버 기동 필요) — 다음 작업자가 `docker compose up`
  상태에서 seed 데이터로 `/ingredients/{id}` 진입해 재확인 권장.

## 체크포인트 (`frontend/20_fe_detail_page.md` 기준)

- [x] RequireAuth 보호
- [x] CONFIRMED/ESTIMATED 시각 구분 (`ExpiryTag`)
- [x] D-day 정확(지난 경우 D+N, `utils/dday.ts` 재사용)
- [x] 로딩·404
- [ ] 피그마 시안 정합 — 와이어프레임 텍스트 명세 기준으로만 구현, 실제 피그마 대조 안 함
- [x] 저장위치 탭 2종(냉장/냉동)
- [x] 수량 스테퍼 동작
- [x] 저장=primary / 삭제=danger, 하단 배치
- [x] 기존 토큰만 사용

## 변경 파일 목록

| 파일 | 내용 |
|------|------|
| `src/components/atoms/ExpiryTag.tsx` | 신규 — 실제 날짜 기반 D-day+상태 배지 |
| `src/components/pages/IngredientDetailPage.tsx` | 신규 — 상세 화면 |
| `src/components/pages/index.ts` | `IngredientDetailPage` export 추가 |
| `src/routes/ingredient.routes.tsx` | `/ingredients/:id` 라우트 추가 |
| `shared/01_STATUS_BOARD.md` | FE-2 → ✅ |
| `dev_docs/.../260830dev_history/2260830_dev_history_03.md` | 본 기록 |

## 다음

**FE-3**: 등록 화면 (`POST /ingredients`) — BE-4 완료 상태라 바로 실연동 가능.
수정/삭제 API 계약이 정해지면 이번 상세 화면의 저장/삭제 버튼도 마저 연동해야 함(부채로 남김).
