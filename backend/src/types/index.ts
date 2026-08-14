export interface JWTPayload {
  id: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'ACCOUNTANT';
  companyId: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  companyId: string;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
