import { Badge } from '../atoms/Badge';
import { getDdayInfo } from '../../utils/dday';
import type { Ingredient } from '../../types';

interface IngredientCardProps {
  ingredient: Ingredient;
}

export function IngredientCard({ ingredient }: IngredientCardProps) {
  const { label, tone } = getDdayInfo(ingredient.expiryDate);

  return (
    <li className="flex items-center justify-between gap-4 rounded-card border border-line bg-surface px-4 py-3.5 shadow-soft">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-semibold text-ink">{ingredient.name}</p>
          <Badge tone={tone}>{label}</Badge>
        </div>
        <p className="mt-1 truncate text-xs text-ink-muted">
          {ingredient.quantityGrams}g
          {ingredient.note ? ` · ${ingredient.note}` : ''}
        </p>
      </div>
    </li>
  );
}
