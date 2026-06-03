export interface User {
  id: number;
  name: string;
  email: string;
  type: UserType;
}

/**
 * userType از init enums استفاده می‌کند
 * (اگر خواستی strict‌ترش کنی)
 */
export type UserType = 'jobseeker' | 'employer' | 'vip_user';