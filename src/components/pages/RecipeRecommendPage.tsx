import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { SearchInput } from '../molecules/SearchInput';
import { RecipeFilterChips } from '../molecules/RecipeFilterChips';
import type { RecipeFilterMode } from '../molecules/RecipeFilterChips';
import { RecipeRecommendList } from '../organisms/RecipeRecommendList';
import { MOCK_RECIPE_MATCHES } from '../../mock/recipeRecommendations';

export function RecipeRecommendPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<RecipeFilterMode>('all');

  const visibleRecipes = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return MOCK_RECIPE_MATCHES.filter((recipe) => {
      if (keyword && !recipe.title.toLowerCase().includes(keyword)) return false;
      if (filter === 'korean') return recipe.cuisine === 'korean';
      if (filter === 'western') return recipe.cuisine === 'western';
      if (filter === 'quick') return recipe.isQuick;
      if (filter === 'expiring') return recipe.usesExpiringIngredient;
      return true;
    });
  }, [query, filter]);

  return (
    <main className="min-h-screen bg-surface-muted pb-16">
      <div className="mx-auto max-w-xl px-5 pt-8">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="뒤로가기"
            className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-ink-soft transition-colors hover:bg-primary-50"
          >
            ‹
          </button>
          <h1 className="text-lg font-bold text-ink">맞춤 레시피</h1>
        </div>

        <div className="mt-5">
          <SearchInput value={query} onChange={setQuery} placeholder="요리명 또는 보유 식재료 검색" />
        </div>

        <div className="mt-4">
          <RecipeFilterChips value={filter} onChange={setFilter} />
        </div>

        <h2 className="mt-6 mb-3 text-sm font-bold text-ink">냉장고 재료로 추천해요</h2>

        <RecipeRecommendList recipes={visibleRecipes} />
      </div>
    </main>
  );
}
