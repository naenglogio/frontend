import { RecipeMatchCard } from '../molecules/RecipeMatchCard';
import { RecipeMissingRow } from '../molecules/RecipeMissingRow';
import type { RecipeMatch } from '../../mock/recipeRecommendations';

interface RecipeRecommendListProps {
  recipes: RecipeMatch[];
}

export function RecipeRecommendList({ recipes }: RecipeRecommendListProps) {
  if (recipes.length === 0) {
    return <p className="py-10 text-center text-sm text-ink-muted">추천할 레시피가 없어요</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {recipes.map((recipe) =>
        recipe.missingCount > 0 ? (
          <RecipeMissingRow key={recipe.id} recipe={recipe} />
        ) : (
          <RecipeMatchCard key={recipe.id} recipe={recipe} />
        ),
      )}
    </div>
  );
}
