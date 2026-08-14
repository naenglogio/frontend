import { RecipeCard, type RecipeCardData } from '../atoms/RecipeCard';

interface RecipeSectionProps {
  recipes: RecipeCardData[];
}

export function RecipeSection({ recipes }: RecipeSectionProps) {
  return (
    <section className="mt-[22px]">
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-ink">오늘 만들 수 있는 레시피</h2>
        <button
          type="button"
          className="inline-flex items-center gap-0.5 text-[12.5px] font-semibold text-primary-600 hover:text-primary-700"
        >
          자세히 보기
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.title} recipe={recipe} />
        ))}

        <button
          type="button"
          className="flex cursor-pointer flex-col items-start justify-center rounded-[--radius-input] bg-[linear-gradient(150deg,var(--color-primary-600),var(--color-primary-700))] p-[18px] text-left text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-[--shadow-soft]"
          aria-label="AI 추천 받기"
        >
          <span className="mb-3 text-[30px] opacity-95" aria-hidden="true">
            ✨
          </span>
          <span className="text-[15px] font-bold">AI 추천 받기</span>
          <span className="mt-1.5 text-[12.5px] text-white/85">냉장고 재료로 새 레시피 제안</span>
        </button>
      </div>
    </section>
  );
}
