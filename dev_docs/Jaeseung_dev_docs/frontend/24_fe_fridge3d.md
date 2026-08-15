# FE-6. 메인 3D 냉장고

## 선행
FE-1 완료 + 3D 기술 스파이크(@react-three/fiber, drei 설치 검증) 완료. (BE-3 완료면 실데이터)

## 함께 읽을 문서
- `../shared/00_API_CONTRACT.md` (2. 목록)
- `../shared/01_STATUS_BOARD.md` (BE-3 상태)
- 현재 `src/components/pages/MainPage.tsx`, `src/components/organisms/FridgeCard.tsx`

## 목표 수준
**레벨 2(드래그 이동) + 상세 이동 인터랙션.** soft delete 연동은 범위 밖(여유 시 레벨 3).
스파이크 실패 시 → 2.5D 폴백.

## 지시 (하위 단계)
### 6-1. 씬 세팅
MainPage의 FridgeCard 자리에 3D 냉장고 컴포넌트 임베드. 냉장(0)/냉동(1) 칸 구분, 조명, OrbitControls.

### 6-2. 오브젝트 배치 (실데이터)
`listIngredients`(소유분, is_deleted=false, `Fridge3DItem[]`)로 식재료를 storage_type별 칸에 배치. expiration_status/expiration_date 기준 임박·만료 색상 강조. 배치 좌표는 프론트 그리드 규칙.

### 6-3. 드래그 이동 (레벨 2)
raycasting + 드래그로 냉장고 안 이동, 냉장/냉동 칸 간 이동 허용(화면 동작까지, 저장 X). 터치·마우스 지원.

### 6-4. 상세 이동 인터랙션 (제스처 분기)
- 판정: 다운 후 이동 > 8px = 드래그 / 정지 + 500ms = 롱프레스. 상호배타.
- **모바일 롱프레스 → "상세화면으로 이동하시겠습니까?" 확인 팝업 → `/ingredients/:id`**
- **웹 더블클릭 → 상세 이동**

## 체크포인트
- [ ] 대시보드에 자연스럽게 임베드, 부드러운 렌더
- [ ] 냉장/냉동 칸 분리 배치, 10건+ 안 겹침
- [ ] 임박 시각 구분
- [ ] 드래그 이동(터치·마우스), 칸 경계 처리
- [ ] 드래그 중 상세 오발동 없음
- [ ] 롱프레스 팝업→이동 / 더블클릭 이동 / 대상 id 정확

## 완료 후
`../shared/01_STATUS_BOARD.md`의 FE-6 → ✅.
