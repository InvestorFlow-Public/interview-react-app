import { http } from '../api/httpClient';
import { tokenStore } from '../api/token';
import type { Credentials, LoginResponse } from '../types/auth';

const RESOURCE = '/api/auth';

export const authService = {
  signup: (dto: Credentials) => http.post<void>(`${RESOURCE}/signup`, dto),

  login: async (dto: Credentials) => {
    const { jwtToken } = await http.post<LoginResponse>(`${RESOURCE}/login`, dto);
    tokenStore.set(jwtToken);
  },

  logout: () => tokenStore.clear(),

  isAuthenticated: () => tokenStore.get() !== null,
};
