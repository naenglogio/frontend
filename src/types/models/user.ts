// 노션 ERD #1 users
import type { UserRole, UserStatus } from './enums';

export interface User {
  id: number;
  email: string;
  // password는 서버 내부 컬럼이므로 API 응답 타입에는 포함하지 않는다.
  name: string;
  terms_agreed: boolean;
  is_notified: boolean;
  status: UserStatus;
  withdrawal_reason_code: number | null;
  withdrawn_at: string | null;
  role: UserRole;
  created_at: string;
}
