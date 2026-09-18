import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../atoms/Button';
import { Modal } from '../atoms/Modal';
import { deleteAccount } from '../../services/profileApi';
import { clearAccessToken } from '../../utils/authToken';

export function AccountManagement() {
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleDelete = async () => {
    setPending(true);
    try {
      await deleteAccount();
      clearAccessToken();
      navigate('/login', { replace: true });
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink">회원 탈퇴</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-muted">
            냉장고 기록과 계정 정보가 모두 삭제되며 복구할 수 없습니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="shrink-0 rounded-input border border-danger/30 px-4 py-2.5 text-sm font-semibold text-danger hover:bg-danger/10"
        >
          회원 탈퇴
        </button>
      </div>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className="text-center">
          <p className="text-base font-bold text-ink">정말 탈퇴하시겠어요?</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            저장된 식재료와 활동 기록을 다시 복구할 수 없어요.
          </p>
        </div>
        <div className="mt-5 flex gap-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={() => setConfirmOpen(false)}>
            취소
          </Button>
          <button
            type="button"
            disabled={pending}
            onClick={() => void handleDelete()}
            className="flex-1 rounded-input bg-danger px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {pending ? '처리 중...' : '탈퇴하기'}
          </button>
        </div>
      </Modal>
    </>
  );
}
