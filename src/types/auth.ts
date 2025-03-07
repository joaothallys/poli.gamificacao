export interface UserRole {
    name: string;
  }
  
  export interface UserData {
    status: string;
    roles: UserRole[];
  }
  
  export interface AuthResponse {
    authorized: boolean;
    message: string;
  }