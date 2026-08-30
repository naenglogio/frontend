import type { RecipeMatch, RecipeMatchTone } from '../../mock/recipeRecommendations';
import { getRecipeYoutubeSearchUrl } from '../../utils/youtube';

interface RecipeMatchCardProps {
  recipe: RecipeMatch;
}

const TONE_CLASS: Record<RecipeMatchTone, string> = {
  warning: 'bg-warning/10 text-warning',
  fresh: 'bg-fresh/10 text-fresh',
};

export function RecipeMatchCard({ recipe }: RecipeMatchCardProps) {
  return (
    <button
      type="button"
      onClick={() => window.open(getRecipeYoutubeSearchUrl(recipe.title), '_blank', 'noopener,noreferrer')}
      className="flex w-full items-start gap-3 rounded-input border border-line bg-surface p-3.5 text-left shadow-soft transition-colors hover:border-primary-200"
    >
      <div
        className="h-14 w-14 shrink-0 rounded-input"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, var(--color-line) 0px, var(--color-line) 1px, transparent 1px, transparent 8px)',
          backgroundColor: 'var(--color-surface-muted)',
        }}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink">{recipe.title}</p>
        <p className="mt-1 text-xs text-ink-muted">
          {recipe.timeMinutes}분 · {recipe.difficulty} · {recipe.servings}인분
        </p>
        <span
          className={`mt-2 inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${TONE_CLASS[recipe.matchTone]}`}
        >
          {recipe.matchLabel}
        </span>
      </div>
    </button>
  );
}
