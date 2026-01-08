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

export const useAuthStore = create<AuthStore>((set) => ({
  auth: {
    id: 0,
    name: '',
    email: '',
    role: 'USER',
    createdAt: '',
    status: 'idle',
  },
  initAfterLogin: (payload: LoginResponse) => {
    if (payload) {
      console.log('payload: ', payload);
      const result: AuthState = {
        id: payload.data.id,
        name: payload.data.name,
        email: payload.data.email,
        role: payload.data.role,
        createdAt: payload.data.createdAt,
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
