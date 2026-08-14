type RankBadgeTone = 'fresh' | 'danger';

interface RankBadgeProps {
  rank: number;
  tone: RankBadgeTone;
}

const toneClass: Record<RankBadgeTone, string> = {
  fresh: 'bg-fresh/15 text-fresh',
  danger: 'bg-danger/15 text-danger',
};

export function RankBadge({ rank, tone }: RankBadgeProps) {
  return (
    <span
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${toneClass[tone]}`}
    >
      {rank}
    </span>
  );
}
