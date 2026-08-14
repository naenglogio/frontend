import { StatCard } from '../molecules/StatCard';

interface StatStripProps {
  total: number;
  expiring: number;
  fresh: number;
}

export function StatStrip({ total, expiring, fresh }: StatStripProps) {
  return (
    <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="식재료 현황">
      <StatCard variant="total" count={total} label="전체 재료" />
      <StatCard variant="warn" count={expiring} label="임박 재료" />
      <StatCard variant="fresh" count={fresh} label="신선 재료" />
    </section>
  );
}
