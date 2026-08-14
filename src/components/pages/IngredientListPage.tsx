import { useMemo, useState } from 'react';
import { StorageTabs } from '../molecules/StorageTabs';
import { SearchInput } from '../molecules/SearchInput';
import { SortFilter } from '../molecules/SortFilter';
import type { SortMode } from '../molecules/SortFilter';
import { IngredientList } from '../organisms/IngredientList';
import { MOCK_INGREDIENTS } from '../../mocks/ingredients';
import { getDaysUntil } from '../../utils/dday';
import type { StorageType } from '../../types';

export function IngredientListPage() {
  const [storageType, setStorageType] = useState<StorageType>('fridge');
  const [query, setQuery] = useState('');
  const [sortMode, setSortMode] = useState<SortMode>('category');

  const visibleIngredients = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const filtered = MOCK_INGREDIENTS.filter(
      (item) => item.storageType === storageType && item.name.toLowerCase().includes(keyword),
    );

    const sorted = [...filtered];
    if (sortMode === 'latest') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortMode === 'expiry') {
      sorted.sort((a, b) => getDaysUntil(a.expiryDate) - getDaysUntil(b.expiryDate));
    } else {
      sorted.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    }
    return sorted;
  }, [storageType, query, sortMode]);

  return (
    <main className="min-h-screen bg-surface-muted pb-16">
      <div className="mx-auto max-w-xl px-5 pt-10">
        <h1 className="text-lg font-bold text-ink">식재료 목록</h1>
        <p className="mt-1 text-sm text-ink-muted">냉장고 속 재료를 한눈에 확인해보세요</p>

        <div className="mt-6">
          <StorageTabs value={storageType} onChange={setStorageType} />
        </div>

        <div className="mt-4">
          <SearchInput value={query} onChange={setQuery} />
        </div>

        <div className="mt-3">
          <SortFilter value={sortMode} onChange={setSortMode} />
        </div>

        <div className="mt-6">
          <IngredientList ingredients={visibleIngredients} sortMode={sortMode} />
        </div>
      </div>
    </main>
  );
}
