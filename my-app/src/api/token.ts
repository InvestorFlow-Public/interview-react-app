// ponytail: localStorage for now; move to an httpOnly cookie if XSS exposure matters.
const KEY = 'token';

export const tokenStore = {
  get: () => localStorage.getItem(KEY),
  set: (token: string) => localStorage.setItem(KEY, token),
  clear: () => localStorage.removeItem(KEY),
};
