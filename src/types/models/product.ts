// 노션 ERD #5 products (최종 정제 상품)
import type { SourceSite } from './enums';

export interface Product {
  id: number;
  food_id: number;
  source_site: SourceSite;
  original_product_id: string;
  name: string;
  product_url: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}
