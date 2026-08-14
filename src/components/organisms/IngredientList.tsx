import { IngredientCard } from './IngredientCard';
import type { SortMode } from '../molecules/SortFilter';
import type { Ingredient } from '../../types';

interface IngredientListProps {
  ingredients: Ingredient[];
  sortMode: SortMode;
}

function groupByCategory(items: Ingredient[]): [string, Ingredient[]][] {
  const map = new Map<string, Ingredient[]>();
  for (const item of items) {
    const list = map.get(item.category) ?? [];
    list.push(item);
    map.set(item.category, list);
  }
  return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b, 'ko'));
}

export function IngredientList({ ingredients, sortMode }: IngredientListProps) {
  if (ingredients.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-sm text-ink-muted">등록된 식재료가 없어요.</p>
      </div>
    );
  }

  if (sortMode !== 'category') {
    return (
      <ul className="flex flex-col gap-3">
        {ingredients.map((item) => (
          <IngredientCard key={item.id} ingredient={item} />
        ))}
      </ul>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {groupByCategory(ingredients).map(([category, items]) => (
        <section key={category}>
          <h2 className="mb-2 text-sm font-bold text-ink-soft">{category}</h2>
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <IngredientCard key={item.id} ingredient={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
