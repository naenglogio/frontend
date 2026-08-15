# FE-3. 등록 화면

## 선행
FE-1 완료. (BE-4 완료면 실연동, 아니면 목업 선개발)

## 함께 읽을 문서
- `../shared/00_API_CONTRACT.md` (3. 등록)
- `../shared/01_STATUS_BOARD.md` (BE-4 상태)

## 지시
`/ingredients/new` 라우트 신설.
- 폼: name, storage_type select(`STORAGE_OPTIONS`), quantity+unit, purchase_date(date picker), expiration_date(date picker), memo.
- `createIngredient(body)` 연동. `IngredientCreateRequest` 사용. **storage_type은 int로 전송.**
- 성공 시 상세 화면(`/ingredients/:id`)으로 이동.
- 서버 422 에러를 필드별로 표시(클라이언트 검증 + 서버 검증).

## 체크포인트
- [ ] storage_type int 전송
- [ ] 클라 검증 + 서버 422 필드별 표시
- [ ] 등록 성공 → 상세 이동
- [ ] date picker 동작

## 완료 후
`../shared/01_STATUS_BOARD.md`의 FE-3 → ✅.
> FE-4(카메라)에서 이 화면으로 프리필 이동하므로, name/category/food_id를 외부에서 주입받을 수 있게 설계.
