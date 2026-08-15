# FE-4. 카메라 인식 화면 + 등록 연결

## 선행
FE-1, FE-3 완료. (BE-7 완료면 실연동, 아니면 목업 선개발)

## 함께 읽을 문서
- `../shared/00_API_CONTRACT.md` (4. 카메라 인식)
- `../shared/01_STATUS_BOARD.md` (BE-7 상태)

## 지시
### 화면
`/ingredients/recognize` 라우트.
- 파일 업로드 + `getUserMedia` 카메라 프리뷰. 권한 거부 시 업로드로 폴백.
- 선택/촬영 이미지 미리보기.

### 인식 연동
- `recognize(image)` 호출 → `CameraRecognizeResponse.candidates`를 confidence 뱃지(%) 카드로 표시.
- 인식 중 로딩, 빈 결과/실패 상태 처리.

### 등록 연결
- 후보 카드 선택 시 `/ingredients/new`로 이동하면서 food_id/name/category 프리필(상태 전달). 사용자가 나머지 필드 보완 후 등록.

## 체크포인트
- [ ] 미리보기 표시, 권한 거부 폴백
- [ ] 모바일 뷰포트 정상
- [ ] confidence % 표기, 실패/빈 결과 처리
- [ ] 프리필 정확·수정 가능
- [ ] 인식 → 등록 → 상세까지 한 번에 연결

## 완료 후
`../shared/01_STATUS_BOARD.md`의 FE-4 → ✅.
