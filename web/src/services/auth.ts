import apiClient from './api';
import { LoginInput, RegisterInput, AuthResponse } from '@/types';

export const authService = {
  register: async (data: RegisterInput) => {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  login: async (data: LoginInput) => {
    return apiClient.post<AuthResponse>('/auth/login', data);
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    return apiClient.get('/auth/me');
  },
};
