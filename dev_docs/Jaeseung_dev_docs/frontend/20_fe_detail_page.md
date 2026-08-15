# FE-2. 상세 화면

## 선행
FE-1 완료. (BE-3 완료면 실연동, 아니면 계약서 기준 목업으로 선개발)

## 함께 읽을 문서
- `../shared/00_API_CONTRACT.md` (1. 상세)
- `../shared/01_STATUS_BOARD.md` (BE-3 상태 확인)

## 지시
`/ingredients/:id` 라우트 신설(App.tsx, `RequireAuth`로 보호).
- `getIngredient(id)` 연동, `IngredientDetailResponse` 사용.
- 재사용: `atoms/DDayTag`, `utils/dday.ts`, `utils/storage.ts`.
- 표시: name, storage_type(라벨), quantity+unit, purchase_date, expiration_date D-day, **expiration_status(CONFIRMED=확정 / ESTIMATED=예상 시각 구분)**, memo, image_url. 상품기반이면 참고 상품/프로필도.
- 삭제·수정 버튼(동작은 다음 단계 또는 여력 시).
- 로딩 스피너, 404 처리.

## 체크포인트
- [ ] RequireAuth 보호
- [ ] CONFIRMED/ESTIMATED 시각 구분
- [ ] D-day 정확(지난 경우 D+N)
- [ ] 로딩·404
- [ ] 피그마 시안 정합

## BE 연동 상태에 따라
- BE-3 ✅ → 실서버 연동
- BE-3 ⬜ → 계약서 기준 목업 응답으로 화면 완성, base URL만 나중에 전환

## 완료 후
`../shared/01_STATUS_BOARD.md`의 FE-2 → ✅.
