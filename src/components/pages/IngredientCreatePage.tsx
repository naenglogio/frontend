import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { SegmentedControl } from '../atoms/SegmentedControl';
import { ApiError } from '../../services/authApi';
import { createIngredient } from '../../services/ingredientApi';
import { STORAGE_OPTIONS } from '../../utils/storage';
import { StorageType } from '../../types/models/enums';
import type { IngredientCreateRequest } from '../../types/features';

/**
 * FE-4(카메라)에서 navigate('/ingredients/new', { state }) 로 넘기는 프리필.
 * name / category / food_id 를 주입받으면 해당 필드가 채워진 채로 진입한다.
 */
export interface IngredientCreatePrefill {
  name?: string;
  category?: string;
  food_id?: number;
}

// SegmentedControl은 string 제네릭 — storage_type(int)은 문자열로 매핑해 사용 (상세 화면과 동일)
const STORAGE_TAB_OPTIONS = STORAGE_OPTIONS.map((option) => ({
  value: String(option.value),
  label: option.label,
}));

/**
 * 직접입력 시 foods 마스터 피커가 아직 없으므로,
 * 카메라 프리필이 없을 때 쓰는 임시 food_id.
 * BE seed(BE-6) / foods 선택 UI 확정 후 교체.
 */
const DIRECT_ENTRY_FOOD_ID = 1;

type FieldErrors = Partial<
  Record<'name' | 'category' | 'quantity' | 'unit' | 'purchase_date' | 'expiration_date' | 'memo' | 'food_id', string>
>;

/** 서버 422 details → 필드 에러 맵 (객체형 / FastAPI loc 배열형 모두 대응) */
function mapServerFieldErrors(details: unknown): FieldErrors {
  const out: FieldErrors = {};
  if (!details) return out;

  if (Array.isArray(details)) {
    for (const item of details) {
      if (!item || typeof item !== 'object') continue;
      const row = item as { loc?: unknown; msg?: unknown; message?: unknown };
      const loc = Array.isArray(row.loc) ? row.loc : [];
      const field = loc.filter((part) => typeof part === 'string' && part !== 'body').at(-1);
      const message =
        typeof row.msg === 'string' ? row.msg : typeof row.message === 'string' ? row.message : undefined;
      if (field && message && field in { name: 1, quantity: 1, unit: 1, purchase_date: 1, expiration_date: 1, memo: 1, food_id: 1 }) {
        out[field as keyof FieldErrors] = message;
      }
    }
    return out;
  }

  if (typeof details === 'object') {
    for (const [key, value] of Object.entries(details as Record<string, unknown>)) {
      if (!(key in { name: 1, quantity: 1, unit: 1, purchase_date: 1, expiration_date: 1, memo: 1, food_id: 1, category: 1 })) {
        continue;
      }
      if (typeof value === 'string') {
        out[key as keyof FieldErrors] = value;
      } else if (Array.isArray(value) && typeof value[0] === 'string') {
        out[key as keyof FieldErrors] = value[0];
      }
    }
  }
  return out;
}

export function IngredientCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  // FE-4 카메라 → 등록 연결용 프리필 (없으면 빈 객체)
  const prefill = (location.state as IngredientCreatePrefill | null) ?? {};

  const [name, setName] = useState(prefill.name ?? '');
  const [category, setCategory] = useState(prefill.category ?? '');
  const [foodId] = useState<number | undefined>(prefill.food_id);
  const [storageType, setStorageType] = useState<StorageType>(StorageType.REFRIGERATED);
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('개');
  const [purchaseDate, setPurchaseDate] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [memo, setMemo] = useState('');
  // 사진 업로드 API는 아직 없음 — UI만 두고 image_url은 선택적으로 비움
  const [imageUrl] = useState<string | null>(null);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const clearFieldError = (field: keyof FieldErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  /** 클라이언트 필수값·양수 검증. 통과 시 null, 실패 시 FieldErrors */
  const validateClient = (): FieldErrors | null => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = '식재료명을 입력해주세요.';
    const qty = Number(quantity);
    if (!quantity.trim() || !Number.isFinite(qty) || qty <= 0) {
      next.quantity = '수량은 1 이상의 숫자를 입력해주세요.';
    }
    return Object.keys(next).length > 0 ? next : null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const clientErrors = validateClient();
    if (clientErrors) {
      setErrors(clientErrors);
      return;
    }

    const resolvedFoodId = foodId ?? DIRECT_ENTRY_FOOD_ID;
    const body: IngredientCreateRequest = {
      food_id: resolvedFoodId,
      name: name.trim(),
      storage_type: storageType, // int 0/1 — 문자열로 바꾸지 않음
      quantity: Number(quantity),
      unit: unit.trim() || null,
      purchase_date: purchaseDate || null,
      expiration_date: expirationDate || null,
      expiration_source: 'USER_INPUT',
      image_url: imageUrl,
      memo: memo.trim() || null,
      product_id: null,
      freshness_profile_id: null,
    };

    setSubmitting(true);
    setErrors({});
    try {
      const created = await createIngredient(body);
      // 등록 성공 → 상세 화면으로 이동
      navigate(`/ingredients/${created.id}`, { replace: true });
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 422) {
        const fieldErrors = mapServerFieldErrors(error.details);
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors);
        } else {
          setFormError(error.message || '입력값을 다시 확인해주세요.');
        }
      } else if (error instanceof ApiError) {
        setFormError(error.message);
      } else {
        setFormError('등록에 실패했어요. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-surface-muted pb-28">
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
          <h1 className="text-lg font-bold text-ink">식재료 등록</h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-6" noValidate>
          {/* 사진 + 이름/카테고리 */}
          <section className="flex gap-3">
            <button
              type="button"
              // TODO(BE): 이미지 업로드 API 확정 시 image_url 연동
              onClick={() =>
                setFormError('사진 추가는 이미지 업로드 API 확정 후 연동될 예정이에요.')
              }
              className="flex h-28 w-28 shrink-0 flex-col items-center justify-center gap-1 rounded-card border-2 border-dashed border-line bg-surface text-xs font-semibold text-ink-muted transition-colors hover:border-primary-300 hover:bg-primary-50"
              aria-label="사진 추가"
            >
              <span className="text-xl text-primary-500" aria-hidden="true">
                +
              </span>
              사진 추가
            </button>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <Input
                id="ingredient-name"
                label="식재료명"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  clearFieldError('name');
                }}
                placeholder="예: 계란"
                error={errors.name}
                autoComplete="off"
              />
              <Input
                id="ingredient-category"
                label="카테고리"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  clearFieldError('category');
                }}
                placeholder="예: 유제품·달걀"
                error={errors.category}
                autoComplete="off"
              />
            </div>
          </section>

          {/* 보관 위치 — 냉장/냉동 2종 (실온 없음) */}
          <section>
            <p className="mb-2 text-sm font-medium text-ink-soft">보관 위치</p>
            <SegmentedControl
              options={STORAGE_TAB_OPTIONS}
              value={String(storageType)}
              onChange={(value) => setStorageType(Number(value) as StorageType)}
            />
          </section>

          {/* 수량 · 단위 2열 */}
          <section className="grid grid-cols-2 gap-3">
            <Input
              id="ingredient-quantity"
              label="수량"
              type="number"
              min={1}
              step="any"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                clearFieldError('quantity');
              }}
              error={errors.quantity}
            />
            <Input
              id="ingredient-unit"
              label="단위"
              value={unit}
              onChange={(e) => {
                setUnit(e.target.value);
                clearFieldError('unit');
              }}
              placeholder="개"
              error={errors.unit}
            />
          </section>

          {/* 구매일 · 유통기한 2열 */}
          <section className="grid grid-cols-2 gap-3">
            <Input
              id="ingredient-purchase-date"
              label="구매일"
              type="date"
              value={purchaseDate}
              onChange={(e) => {
                setPurchaseDate(e.target.value);
                clearFieldError('purchase_date');
              }}
              error={errors.purchase_date}
            />
            <Input
              id="ingredient-expiration-date"
              label="유통기한"
              type="date"
              value={expirationDate}
              onChange={(e) => {
                setExpirationDate(e.target.value);
                clearFieldError('expiration_date');
              }}
              error={errors.expiration_date}
            />
          </section>

          {/* 알림 시점 — 선영 담당, 값 표시만 */}
          <section className="rounded-card border border-line bg-surface px-4 py-3 shadow-soft">
            <p className="text-sm font-medium text-ink-soft">알림 시점</p>
            <p className="mt-1 text-sm text-ink-muted">만료 3일 전</p>
          </section>

          <Input
            id="ingredient-memo"
            label="메모"
            value={memo}
            onChange={(e) => {
              setMemo(e.target.value);
              clearFieldError('memo');
            }}
            placeholder="선택 입력"
            error={errors.memo}
          />

          {formError && (
            <p className="rounded-input bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
              {formError}
            </p>
          )}

          <Button type="submit" variant="primary" className="w-full" loading={submitting}>
            등록하기
          </Button>
        </form>
      </div>
    </main>
  );
}
