export interface UserData {
  id: number;
  email: string;
  name: string;
  roles_deprecated_id: string;
  first_account?: number;
  user_uuid?: string;
  accept_terms?: boolean;
}