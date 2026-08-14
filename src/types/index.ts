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
