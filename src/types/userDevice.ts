// 노션 ERD #2 user_devices
import type { DevicePlatform } from './enums';

export interface UserDevice {
  id: number;
  user_id: number;
  device_token: string;
  platform: DevicePlatform;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
  updated_at: string | null;
}
