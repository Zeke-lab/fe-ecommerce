//  TODO: we will make related requests to server here!

import { useQuery } from '@tanstack/react-query';
import type { LoginFormValues } from '../../../pages/auth/Login';
import type { RegisterFormValues } from '../../../pages/auth/Register';
import { apiClient } from '../apiClient';
import { ApiConstantRoutes } from '../path';

// Login
export interface LoginResponse {
  data: {
    id: number;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
    createdAt: string;
  };
}

// Register
export interface RegisterResponse {
  email: string;
  name: string;
}

async function registerUser(
  values: RegisterFormValues,
): Promise<RegisterResponse> {
  return apiClient.post(ApiConstantRoutes.paths.auth.register, values);
}

async function loginUser(values: LoginFormValues): Promise<LoginResponse> {
  return apiClient.post(ApiConstantRoutes.paths.auth.login, values);
}

const useIsUserAuthenticated = () => {
  return useQuery<LoginResponse>({
    queryKey: ['isUserAuthenticated'],
    queryFn: async () => {
      return apiClient.get(ApiConstantRoutes.paths.auth.default);
    },
  });
};

export { registerUser, loginUser, useIsUserAuthenticated };
