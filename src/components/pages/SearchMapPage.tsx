import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { SearchInput } from '../molecules/SearchInput';
import { NearbyMartMap } from '../organisms/NearbyMartMap';
import { MartResultList } from '../organisms/MartResultList';
import { MOCK_MARTS } from '../../mock/marts';

export function SearchMapPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const visibleMarts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return MOCK_MARTS;
    return MOCK_MARTS.filter((mart) => mart.name.toLowerCase().includes(keyword));
  }, [query]);

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
          <h1 className="text-lg font-bold text-ink">지도 (주변 마트)</h1>
        </div>

        <div className="mt-5">
          <NearbyMartMap />
        </div>

        <div className="mt-4">
          <SearchInput value={query} onChange={setQuery} placeholder="주소 검색" />
        </div>

        <div className="mt-4">
          <MartResultList marts={visibleMarts} />
        </div>
      </div>
    </main>
  );
}
