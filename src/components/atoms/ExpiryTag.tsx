import { Badge } from './Badge';
import { getDdayInfo } from '../../utils/dday';
import type { ExpirationStatus } from '../../types/models/enums';

interface ExpiryTagProps {
  expirationDate: string | null;
  status: ExpirationStatus;
}

/**
 * 실제 expiration_date(문자열)로 D-day를 계산해 배지를 그리는 확장판.
 * 기존 atoms/DDayTag는 mock/home의 DDay(0/1/3 리터럴)에 묶여 있어 재사용할 수 없어
 * 02_DESIGN_SYSTEM.md 방침대로 신규 컴포넌트로 분리했다(기존 DDayTag는 그대로 유지).
 * - CONFIRMED: D-day 배지만.
 * - ESTIMATED: D-day 배지 + "예상" 배지(warning).
 * - expiration_date가 없는 예상 상태(기준일 불명)는 날짜 미정으로 표시.
 */
export function ExpiryTag({ expirationDate, status }: ExpiryTagProps) {
  if (!expirationDate) {
    return <Badge tone="warning">예상 · 날짜 미정</Badge>;
  }

  const { label, tone } = getDdayInfo(expirationDate);

  return (
    <span className="inline-flex items-center gap-1.5">
      <Badge tone={tone}>{label}</Badge>
      {status === 'ESTIMATED' && <Badge tone="warning">예상</Badge>}
    </span>
  );
}
