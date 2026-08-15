// storage_type(int 정본) ↔ 화면 표시 라벨 매핑.
// DB/API는 int(0/1)로 다루고, 화면 표시에서만 한글 라벨로 변환한다.
import { StorageType } from '../types/models/enums';

const STORAGE_LABELS: Record<StorageType, string> = {
  [StorageType.REFRIGERATED]: '냉장',
  [StorageType.FROZEN]: '냉동',
};

export function storageLabel(value: StorageType): string {
  return STORAGE_LABELS[value] ?? '알 수 없음';
}

// select 등에서 쓸 옵션 목록.
export const STORAGE_OPTIONS: { value: StorageType; label: string }[] = [
  { value: StorageType.REFRIGERATED, label: '냉장' },
  { value: StorageType.FROZEN, label: '냉동' },
];
