// 기능: 식재료 카메라 인식 (재성)
// POST /api/v1/ingredients/recognitions
// 노션: 카메라는 foods 참조, 인식 후보를 등록 화면으로 전달.

// 인식 후보 한 건. 등록 화면 프리필에 바로 쓸 수 있는 형태.
export interface RecognitionCandidate {
  food_id: number | null; // 표준 식재료 매칭 결과 (없으면 null)
  name: string;
  category: string | null; // 추정 카테고리 표시용
  confidence: number; // 0~1
}

// 인식 응답: 후보 리스트 (confidence 내림차순).
export interface CameraRecognizeResponse {
  candidates: RecognitionCandidate[];
}
