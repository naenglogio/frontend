import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Button } from '../atoms/Button';
import { ExpiryTag } from '../atoms/ExpiryTag';
import { Modal } from '../atoms/Modal';
import { SegmentedControl } from '../atoms/SegmentedControl';
import { ApiError } from '../../services/authApi';
import { getIngredient } from '../../services/ingredientApi';
import { getDdayInfo } from '../../utils/dday';
import { STORAGE_OPTIONS, storageLabel } from '../../utils/storage';
import { StorageType } from '../../types/models/enums';
import type { IngredientDetailResponse } from '../../types/features';

// SegmentedControl은 T extends string 제네릭이라 storage_type(int 0/1)을 문자열로 매핑해 쓴다.
// (02_DESIGN_SYSTEM.md "storage_type 표시" 참고)
const STORAGE_TAB_OPTIONS = STORAGE_OPTIONS.map((option) => ({
  value: String(option.value),
  label: option.label,
}));

export function IngredientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ingredientId = Number(id);

  // id가 숫자가 아니면(예: /ingredients/abc) fetch할 필요 없이 바로 404로 취급.
  // 초기 state에서 분기해두면 effect 본문에서 "설정만 하고 끝나는" setState가 없어진다.
  const idIsValid = Number.isFinite(ingredientId);

  const [detail, setDetail] = useState<IngredientDetailResponse | null>(null);
  const [loading, setLoading] = useState(idIsValid);
  const [notFound, setNotFound] = useState(!idIsValid);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 저장위치·수량은 화면에서 바로 편집 가능(와이어프레임 "상세 / 편집"). 상세 로드 후 초기화.
  const [storageType, setStorageType] = useState<StorageType>(StorageType.REFRIGERATED);
  const [quantity, setQuantity] = useState(1);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!idIsValid) return;

    let cancelled = false;

    getIngredient(ingredientId)
      .then((data) => {
        if (cancelled) return;
        setDetail(data);
        setStorageType(data.storage_type);
        setQuantity(data.quantity);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 404) {
          setNotFound(true);
        } else {
          setLoadError('식재료 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ingredientId, idIsValid]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-muted">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-primary-100 border-t-primary-500"
          role="status"
          aria-label="불러오는 중"
        />
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface-muted px-6 text-center">
        <p className="text-base font-semibold text-ink">식재료를 찾을 수 없어요</p>
        <p className="text-sm text-ink-muted">삭제되었거나 존재하지 않는 항목이에요.</p>
        <Link to="/ingredients" className="mt-2 text-sm font-semibold text-primary-600 hover:text-primary-700">
          목록으로 돌아가기
        </Link>
      </main>
    );
  }

  if (loadError || !detail) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-surface-muted px-6 text-center">
        <p className="text-sm text-danger">{loadError ?? '알 수 없는 오류가 발생했어요.'}</p>
        <Link to="/ingredients" className="mt-2 text-sm font-semibold text-primary-600 hover:text-primary-700">
          목록으로 돌아가기
        </Link>
      </main>
    );
  }

  const ddayInfo = detail.expiration_date ? getDdayInfo(detail.expiration_date) : null;
  const expiryBorderClass =
    ddayInfo?.tone === 'danger'
      ? 'border-danger'
      : detail.expiration_status === 'ESTIMATED'
        ? 'border-warning'
        : 'border-line';

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
          <h1 className="text-lg font-bold text-ink">식재료 상세</h1>
        </div>

        {/* 이미지 */}
        <div className="mt-5 flex h-48 items-center justify-center overflow-hidden rounded-card bg-surface shadow-soft">
          {detail.image_url ? (
            <img src={detail.image_url} alt={detail.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-5xl" aria-hidden="true">
              🥬
            </span>
          )}
        </div>

        {/* 이름 */}
        <h2 className="mt-5 text-xl font-bold text-ink">{detail.name}</h2>

        {/* 저장 위치 */}
        <section className="mt-6">
          <p className="mb-2 text-sm font-medium text-ink-soft">저장 위치</p>
          <SegmentedControl
            options={STORAGE_TAB_OPTIONS}
            value={String(storageType)}
            onChange={(value) => setStorageType(Number(value) as StorageType)}
          />
        </section>

        {/* 수량 */}
        <section className="mt-6">
          <p className="mb-2 text-sm font-medium text-ink-soft">수량</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="수량 감소"
              className="flex h-9 w-9 items-center justify-center rounded-input bg-surface-muted text-lg font-bold text-ink-soft transition-colors hover:bg-primary-100"
            >
              −
            </button>
            <span className="min-w-16 text-center text-base font-semibold text-ink">
              {quantity}
              {detail.unit ?? ''}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="수량 증가"
              className="flex h-9 w-9 items-center justify-center rounded-input bg-surface-muted text-lg font-bold text-ink-soft transition-colors hover:bg-primary-100"
            >
              +
            </button>
          </div>
        </section>

        {/* 유통기한 */}
        <section className={`mt-6 rounded-card border-2 bg-surface p-4 shadow-soft ${expiryBorderClass}`}>
          <p className="mb-2 text-sm font-medium text-ink-soft">유통기한</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-ink">{detail.expiration_date ?? '미정'}</span>
            <ExpiryTag expirationDate={detail.expiration_date} status={detail.expiration_status} />
          </div>
          {detail.purchase_date && (
            <p className="mt-1 text-xs text-ink-muted">구매일 {detail.purchase_date}</p>
          )}
        </section>

        {/* 참고 상품/프로필 (상품 기반 등록인 경우만) */}
        {detail.product && (
          <section className="mt-6 rounded-card border border-line bg-surface p-4 shadow-soft">
            <p className="mb-2 text-sm font-medium text-ink-soft">참고 상품</p>
            <div className="flex items-center gap-3">
              {detail.product.image_url && (
                <img
                  src={detail.product.image_url}
                  alt={detail.product.name}
                  className="h-12 w-12 rounded-input object-cover"
                />
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{detail.product.name}</p>
                {detail.freshness_profile && (
                  <p className="text-xs text-ink-muted">
                    {storageLabel(detail.freshness_profile.storage_type)} 기준 소비기한{' '}
                    {detail.freshness_profile.shelf_life_days}일
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 메모 */}
        {detail.memo && (
          <section className="mt-6">
            <p className="mb-2 text-sm font-medium text-ink-soft">메모</p>
            <p className="rounded-card border border-line bg-surface p-4 text-sm text-ink-soft shadow-soft">
              {detail.memo}
            </p>
          </section>
        )}

        {actionNotice && (
          <p className="mt-6 rounded-input bg-warning/10 px-4 py-3 text-sm text-warning">{actionNotice}</p>
        )}

        {/* 하단 액션 */}
        <div className="mt-8 flex flex-col gap-3">
          <Button
            variant="primary"
            className="w-full"
            onClick={() =>
              // TODO(BE): PATCH /ingredients/{id} 계약이 아직 없음 — 확정되면 실연동.
              setActionNotice('수정 저장 기능은 백엔드 수정 API 확정 후 연동될 예정이에요.')
            }
          >
            저장
          </Button>
          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            className="text-sm font-semibold text-danger transition-colors hover:text-danger/80"
          >
            삭제
          </button>
        </div>
      </div>

      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <p className="text-base font-bold text-ink">이 식재료를 삭제할까요?</p>
        <p className="mt-1 text-sm text-ink-muted">{detail.name}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
            취소
          </Button>
          <Button
            variant="primary"
            className="bg-danger hover:bg-danger/90"
            onClick={() => {
              // TODO(BE): DELETE /ingredients/{id} 계약이 아직 없음 — 확정되면 실연동.
              setDeleteModalOpen(false);
              setActionNotice('삭제 기능은 백엔드 삭제 API 확정 후 연동될 예정이에요.');
            }}
          >
            삭제
          </Button>
        </div>
      </Modal>
    </main>
  );
}
