// 노션 ERD #4 foods (표준 식재료 Master)
export interface Food {
  id: number;
  category_id: number | null;
  name: string;
  matched_food_type: string | null;
  match_attempted_at: string | null;
  created_at: string;
  updated_at: string | null;
}
