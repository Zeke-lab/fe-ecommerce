import { create } from 'zustand';
import type { LoginResponse } from '../network/libs/auth';

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
        id: payload.id,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        createdAt: payload.createdAt,
        status: 'success',
      };
      set({ auth: result });
      // TODO: save in local storage
    } else {
      console.log('AuthStore: user login failed: ', payload);
      set({ auth: { ...useAuthStore.getState().auth, status: 'failed' } });
    }
  },
  cleanupAfterLogout: () => {
    // TODO: clear local storage
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
