// 공통 API 계약. 백엔드 app/api/schemas.py와 형태를 맞춘다.

// 목록 응답 표준 형태 (page는 1부터 시작).
export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  total: number;
}

// 공통 오류 응답.
export interface ErrorResponse {
  code: string;
  message: string;
  details?: unknown;
}
