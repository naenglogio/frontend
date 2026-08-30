export type RecipeCuisine = 'korean' | 'western';
export type RecipeMatchTone = 'warning' | 'fresh';

export interface RecipeMatch {
  id: string;
  title: string;
  timeMinutes: number;
  difficulty: string;
  servings: number;
  matchLabel: string;
  matchTone: RecipeMatchTone;
  cuisine: RecipeCuisine;
  isQuick: boolean;
  usesExpiringIngredient: boolean;
  missingCount: number;
  missingIngredient?: string;
}

export const MOCK_RECIPE_MATCHES: RecipeMatch[] = [
  {
    id: 'r1',
    title: '우유 크림 파스타',
    timeMinutes: 20,
    difficulty: '쉬움',
    servings: 1,
    matchLabel: '재료 보유 90%',
    matchTone: 'warning',
    cuisine: 'western',
    isQuick: true,
    usesExpiringIngredient: true,
    missingCount: 0,
  },
  {
    id: 'r2',
    title: '시금치 오믈렛',
    timeMinutes: 15,
    difficulty: '쉬움',
    servings: 2,
    matchLabel: '바로 만들 수 있어요',
    matchTone: 'fresh',
    cuisine: 'western',
    isQuick: true,
    usesExpiringIngredient: true,
    missingCount: 0,
  },
  {
    id: 'r3',
    title: '두부 김치',
    timeMinutes: 25,
    difficulty: '보통',
    servings: 2,
    matchLabel: '',
    matchTone: 'warning',
    cuisine: 'korean',
    isQuick: false,
    usesExpiringIngredient: false,
    missingCount: 1,
    missingIngredient: '김치',
  },
];
