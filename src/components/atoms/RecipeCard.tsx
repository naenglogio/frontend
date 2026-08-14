export interface RecipeCardData {
  emoji: string;
  title: string;
  meta: string;
  chip: 'near' | 'ready';
}

interface RecipeCardProps {
  recipe: RecipeCardData;
  className?: string;
}

export function RecipeCard({ recipe, className = '' }: RecipeCardProps) {
  const chipLabel = recipe.chip === 'ready' ? '바로 가능' : '재료 90%';
  const chipClass =
    recipe.chip === 'ready'
      ? 'bg-fresh/10 text-fresh'
      : 'bg-warning/10 text-warning';

  return (
    <article
      className={`relative cursor-pointer overflow-hidden rounded-[--radius-input] border border-line bg-surface p-[18px] shadow-soft transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-[--shadow-soft] ${className}`}
    >
      <span
        className={`absolute top-3.5 right-3.5 rounded-full px-2.5 py-1 text-[10.5px] font-bold ${chipClass}`}
      >
        {chipLabel}
      </span>
      <div className="mb-3 text-[30px]" aria-hidden="true">
        {recipe.emoji}
      </div>
      <h3 className="text-[15px] font-bold text-ink">{recipe.title}</h3>
      <p className="mt-1.5 text-[12.5px] text-ink-soft">{recipe.meta}</p>
    </article>
  );
}
