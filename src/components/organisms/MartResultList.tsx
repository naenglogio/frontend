import { MartListItem } from '../molecules/MartListItem';
import type { Mart } from '../../mock/marts';

interface MartResultListProps {
  marts: Mart[];
}

export function MartResultList({ marts }: MartResultListProps) {
  if (marts.length === 0) {
    return <p className="py-8 text-center text-sm text-ink-muted">검색 결과가 없어요</p>;
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {marts.map((mart) => (
        <li key={mart.id}>
          <MartListItem name={mart.name} distanceKm={mart.distanceKm} isOpen={mart.isOpen} />
        </li>
      ))}
    </ul>
  );
}
