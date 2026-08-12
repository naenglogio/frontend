const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';
const API_PREFIX = '/api/v1';

interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.code = body.code;
    this.status = status;
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${API_PREFIX}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = (await res.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(
      res.status,
      errorBody ?? { code: 'UNKNOWN', message: `요청에 실패했어요 (${res.status})` },
    );
  }

  if (res.status === 202 || res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export async function requestEmailVerification(email: string): Promise<void> {
  await postJson<void>('/users/email-verifications', { email });
}

export async function confirmEmailVerification(email: string, code: string): Promise<boolean> {
  const result = await postJson<{ verified: boolean }>('/users/email-verifications/confirm', {
    email,
    code,
  });
  return result.verified;
}

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
}

export interface SignupResponse {
  id: number;
  email: string;
  nickname: string;
  notification_agreed: boolean;
  created_at: string;
}

export async function signup(payload: SignupRequest): Promise<SignupResponse> {
  return postJson<SignupResponse>('/users/signup', payload);
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  return postJson<LoginResponse>('/users/login', payload);
}
