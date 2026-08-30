import type { RecipeMatch } from '../../mock/recipeRecommendations';
import { getRecipeYoutubeSearchUrl } from '../../utils/youtube';

interface RecipeMissingRowProps {
  recipe: RecipeMatch;
}

export function RecipeMissingRow({ recipe }: RecipeMissingRowProps) {
  return (
    <button
      type="button"
      onClick={() => window.open(getRecipeYoutubeSearchUrl(recipe.title), '_blank', 'noopener,noreferrer')}
      className="flex w-full items-center justify-between rounded-input border border-line bg-surface px-3.5 py-3.5 text-left shadow-soft transition-colors hover:border-primary-200"
    >
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink">{recipe.title}</p>
        <p className="mt-1 text-xs text-ink-muted">
          부족한 재료 {recipe.missingCount}개 · {recipe.missingIngredient}
        </p>
      </div>
      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-ink-muted" fill="none" aria-hidden="true">
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
