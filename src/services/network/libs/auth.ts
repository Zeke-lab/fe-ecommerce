//  TODO: we will make related requests to server here!

import { useQuery } from '@tanstack/react-query';
import type { LoginFormValues } from '../../../pages/auth/Login';
import type { RegisterFormValues } from '../../../pages/auth/Register';
import { apiClient } from '../apiClient';
import { ApiConstantRoutes } from '../path';
import type { Role } from '@/types/role';

// Login
export interface LoginResponse {
  id: number;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
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
