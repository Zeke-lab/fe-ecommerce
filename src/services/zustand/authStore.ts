import { create } from 'zustand';
import type { LoginResponse } from '../network/libs/auth';
import { LocalServices } from '../storage/LocalServices';

export interface AuthState {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  status: 'idle' | 'failed' | 'success';
}

type AuthStore = {
  auth: AuthState;
  initAfterLogin: (payload: LoginResponse) => void;
  cleanupAfterLogout: () => void;
};

// Initialize auth state from localStorage if available
const getInitialAuthState = (): AuthState => {
  const storedAuth = LocalServices.getLocalStorage();
  if (storedAuth) {
    return storedAuth;
  }
  return {
    id: 0,
    name: '',
    email: '',
    role: 'USER',
    createdAt: '',
    status: 'idle',
  };
};

export const useAuthStore = create<AuthStore>((set) => ({
  auth: getInitialAuthState(),
  initAfterLogin: (payload: LoginResponse) => {
    if (payload) {
      console.log('payload: ', payload);
      const result: AuthState = {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        createdAt: payload.createdAt,
        status: 'success',
      };
      set({ auth: result });
      LocalServices.setLocalStorage(result);
    } else {
      console.log('AuthStore: user login failed: ', payload);
      set({ auth: { ...useAuthStore.getState().auth, status: 'failed' } });
    }
  },
  cleanupAfterLogout: () => {
    LocalServices.clearLocalStorage();
    set({
      auth: {
        id: 0,
        name: '',
        email: '',
        role: 'USER',
        createdAt: '',
        status: 'idle',
      },
    });
  },
}));

export const selectAuth = (state: AuthStore) => state.auth;
export const initAfterLogin = (payload: LoginResponse) =>
  useAuthStore.getState().initAfterLogin(payload);
export const cleanupAfterLogout = () =>
  useAuthStore.getState().cleanupAfterLogout();
