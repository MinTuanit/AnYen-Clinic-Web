export interface User {
  id: string;
  name: string;
  phone_number: string;
  avatar_url: string;
  role_value: string;
  active_status?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
