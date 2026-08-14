export const user = { name: '홍길동', initial: '홍' };
export const stats = { total: 24, expiring: 3, fresh: 6 };
export const fridge = { cold: 18, frozen: 6, expiring: 3 };

export type DDay = 0 | 1 | 3;

export const expiringItems = [
  { emoji: '🥛', name: '우유', location: '냉장실 · 200ml', dday: 0 as DDay },
  { emoji: '🥬', name: '시금치', location: '냉장실 · 1단', dday: 1 as DDay },
  { emoji: '🍗', name: '닭가슴살', location: '냉동실 · 300g', dday: 3 as DDay },
  { emoji: '🧀', name: '체다치즈', location: '냉장실 · 5장', dday: 3 as DDay },
];

export const recipes = [
  {
    emoji: '🍝',
    title: '우유 크림 파스타',
    meta: '재료 보유 90% · 20분',
    chip: 'near' as const,
  },
  {
    emoji: '🍳',
    title: '시금치 오믈렛',
    meta: '바로 만들 수 있어요 · 10분',
    chip: 'ready' as const,
  },
];

// TODO: services/homeApi.ts (GET /api/fridge 등)
