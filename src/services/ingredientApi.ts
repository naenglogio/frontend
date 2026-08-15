/**
 * 식재료 API 클라이언트 (FE-1)
 * - 계약서: shared/00_API_CONTRACT.md (§1~§5)
 * - 인증·에러: authApi.ts 의 ApiError 패턴 재사용, prefix `/api/v1`
 * - 타입: @/types/models, @/types/features 만 사용 (옛 types/index.ts 미사용)
 *
 * [로그인 영역 경계 — 이 파일에서 하지 않는 것]
 * - LoginForm / login() / 토큰 발급·저장 로직은 타 담당 영역이라 수정하지 않는다.
 * - authApi.ts, authToken.ts 파일 자체도 수정하지 않는다.
 * - 여기서는 이미 저장된 토큰을 읽어서(getAccessToken) 요청 헤더에만 붙인다.
 */
// ApiError: authApi.ts 에서 import 만 함 (authApi 파일·login() 미수정)
import { ApiError } from './authApi';
// getAccessToken: 기존 authToken.ts 유틸을 그대로 호출만 함 (토큰 저장/발급 로직 미수정)
import { getAccessToken } from '@/utils/authToken';
import type { ExpirationStatus, Ingredient, StorageType } from '@/types/models';
import type {
  CameraRecognizeResponse,
  IngredientCreateRequest,
  IngredientDetailResponse,
  IngredientSummaryResponse,
  Page,
} from '@/types/features';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const API_PREFIX = '/api/v1';

/** 계약서 공통 오류 본문 형태 */
interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

/** 목록 조회 쿼리. storage_type / expiration_status 는 optional 필터. */
export interface ListIngredientsParams {
  storage_type?: StorageType;
  expiration_status?: ExpirationStatus;
  page?: number;
  size?: number;
}

/**
 * Authorization 헤더 — 로그인 토큰이 있으면 Bearer 로 첨부.
 * 토큰이 없으면 헤더를 생략하고, 서버가 401 을 주면 ApiError 로 전달한다.
 * (토큰을 새로 만들거나 localStorage 에 쓰지 않음 — 읽기 전용)
 */
function authHeaders(extra?: HeadersInit): HeadersInit {
  const headers: Record<string, string> = {
    ...(extra as Record<string, string> | undefined),
  };
  // 기존 authToken 유틸로 "이미 로그인 담당이 저장해 둔" 토큰만 조회
  const token = getAccessToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

/**
 * 실패 응답(401/404/422 포함)을 ApiError 로 변환해 throw.
 * JSON 파싱 실패 시에도 status 기반 메시지로 통일한다.
 */
async function throwIfNotOk(res: Response): Promise<void> {
  if (res.ok) return;
  const errorBody = (await res.json().catch(() => null)) as ApiErrorBody | null;
  throw new ApiError(
    res.status,
    errorBody ?? { code: 'UNKNOWN', message: `요청에 실패했어요 (${res.status})` },
  );
}

/** JSON GET — 목록/상세/집계 공통 */
async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    method: 'GET',
    headers: authHeaders({ Accept: 'application/json' }),
  });
  await throwIfNotOk(res);
  return res.json() as Promise<T>;
}

/** JSON POST — 등록 공통 */
async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json', Accept: 'application/json' }),
    body: JSON.stringify(body),
  });
  await throwIfNotOk(res);
  return res.json() as Promise<T>;
}

/** multipart POST — 카메라 인식 (Content-Type 은 브라우저가 boundary 포함해 설정) */
async function postMultipart<T>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    method: 'POST',
    headers: authHeaders({ Accept: 'application/json' }),
    body: formData,
  });
  await throwIfNotOk(res);
  return res.json() as Promise<T>;
}

/** undefined 값은 쿼리에서 제외해 optional 필터를 표현 */
function toQuery(params: ListIngredientsParams): string {
  const q = new URLSearchParams();
  if (params.storage_type !== undefined) q.set('storage_type', String(params.storage_type));
  if (params.expiration_status !== undefined) q.set('expiration_status', params.expiration_status);
  if (params.page !== undefined) q.set('page', String(params.page));
  if (params.size !== undefined) q.set('size', String(params.size));
  const s = q.toString();
  return s ? `?${s}` : '';
}

/**
 * GET /api/v1/ingredients
 * 소유분·is_deleted=false 목록. 응답 Page<Ingredient>.
 */
export async function listIngredients(
  params: ListIngredientsParams = {},
): Promise<Page<Ingredient>> {
  return getJson<Page<Ingredient>>(`/ingredients${toQuery(params)}`);
}

/**
 * GET /api/v1/ingredients/{id}
 * 상세. 없거나 남의 것이면 404 → ApiError.
 */
export async function getIngredient(id: number): Promise<IngredientDetailResponse> {
  return getJson<IngredientDetailResponse>(`/ingredients/${id}`);
}

/**
 * POST /api/v1/ingredients
 * 등록. 검증 실패 시 422 → ApiError. storage_type 은 int(0/1) 그대로 전송.
 */
export async function createIngredient(body: IngredientCreateRequest): Promise<Ingredient> {
  return postJson<Ingredient>('/ingredients', body);
}

/**
 * GET /api/v1/ingredients/summary
 * 대시보드 집계 (StatStrip / FridgeCard / ExpiringCard).
 */
export async function getSummary(): Promise<IngredientSummaryResponse> {
  return getJson<IngredientSummaryResponse>('/ingredients/summary');
}

/**
 * POST /api/v1/ingredients/recognitions
 * multipart 필드명 `image`. 응답 후보는 등록 화면 프리필에 사용.
 */
export async function recognize(image: File): Promise<CameraRecognizeResponse> {
  const formData = new FormData();
  formData.append('image', image);
  return postMultipart<CameraRecognizeResponse>('/ingredients/recognitions', formData);
}
