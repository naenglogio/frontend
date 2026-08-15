// 노션 ERD #8 notifications
export interface Notification {
  id: number;
  user_id: number;
  ingredient_id: number;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
