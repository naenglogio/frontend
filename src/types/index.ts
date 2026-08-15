// 선영·우희 화면용 옛 스키마. 노션 ERD 타입은 @/types/models, @/types/features 를 사용한다.
export type StorageType = 'fridge' | 'freezer';

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  storageType: StorageType;
  quantityGrams: number;
  expiryDate: string;
  note?: string;
  createdAt: string;
}
