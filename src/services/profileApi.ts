const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// TODO: 백엔드 내정보 API 완성되면 이 파일 전체를 실제 fetch 호출로 교체

export interface ProfileInfo {
  email: string;
  notificationAgreed: boolean;
}

const mockProfile: ProfileInfo = {
  email: 'songwoohee@naver.com',
  notificationAgreed: true,
};

export async function fetchProfile(): Promise<ProfileInfo> {
  await wait(400);
  return { ...mockProfile };
}

export async function updateNotificationPreference(agreed: boolean): Promise<void> {
  await wait(300);
  mockProfile.notificationAgreed = agreed;
  console.info('[mock] 알림 동의 변경', agreed);
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await wait(500);
  console.info('[mock] 비밀번호 변경 요청', {
    currentPasswordLength: payload.currentPassword.length,
    newPasswordLength: payload.newPassword.length,
  });
}

export type StatsPeriod = '3d' | '7d' | '10d' | '15d' | '30d';

export const STATS_PERIOD_OPTIONS: { value: StatsPeriod; label: string }[] = [
  { value: '3d', label: '3일' },
  { value: '7d', label: '7일' },
  { value: '10d', label: '10일' },
  { value: '15d', label: '15일' },
  { value: '30d', label: '한달' },
];

export interface IngredientFrequencyItem {
  name: string;
  count: number;
}

export interface IngredientStats {
  eatenCount: number;
  discardedCount: number;
  frequentlyEaten: IngredientFrequencyItem[];
  frequentlyDiscarded: IngredientFrequencyItem[];
}

const mockStatsByPeriod: Record<StatsPeriod, IngredientStats> = {
  '3d': {
    eatenCount: 4,
    discardedCount: 1,
    frequentlyEaten: [
      { name: '계란', count: 3 },
      { name: '우유', count: 2 },
    ],
    frequentlyDiscarded: [{ name: '상추', count: 1 }],
  },
  '7d': {
    eatenCount: 9,
    discardedCount: 2,
    frequentlyEaten: [
      { name: '계란', count: 5 },
      { name: '두부', count: 3 },
      { name: '우유', count: 3 },
    ],
    frequentlyDiscarded: [
      { name: '상추', count: 2 },
      { name: '대파', count: 1 },
    ],
  },
  '10d': {
    eatenCount: 13,
    discardedCount: 3,
    frequentlyEaten: [
      { name: '계란', count: 7 },
      { name: '두부', count: 4 },
      { name: '우유', count: 4 },
      { name: '김치', count: 3 },
    ],
    frequentlyDiscarded: [
      { name: '상추', count: 2 },
      { name: '대파', count: 1 },
    ],
  },
  '15d': {
    eatenCount: 18,
    discardedCount: 5,
    frequentlyEaten: [
      { name: '계란', count: 9 },
      { name: '두부', count: 6 },
      { name: '우유', count: 5 },
      { name: '김치', count: 4 },
    ],
    frequentlyDiscarded: [
      { name: '상추', count: 3 },
      { name: '대파', count: 2 },
      { name: '버섯', count: 1 },
    ],
  },
  '30d': {
    eatenCount: 31,
    discardedCount: 8,
    frequentlyEaten: [
      { name: '계란', count: 14 },
      { name: '두부', count: 10 },
      { name: '우유', count: 9 },
      { name: '김치', count: 7 },
    ],
    frequentlyDiscarded: [
      { name: '상추', count: 4 },
      { name: '대파', count: 3 },
      { name: '버섯', count: 2 },
    ],
  },
};

export async function fetchIngredientStats(period: StatsPeriod): Promise<IngredientStats> {
  await wait(400);
  return mockStatsByPeriod[period];
}
