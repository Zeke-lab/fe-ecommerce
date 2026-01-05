//  TODO: we will make related requests to server here!

import type { LoginFormValues } from '../../../pages/auth/Login';
import type { RegisterFormValues } from '../../../pages/auth/Register';
import { apiClient } from '../apiClient';
import { ApiConstantRoutes } from '../path';

// Login
export interface LoginResponse {
  id: number;
  email: string;
  name: string;
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

export { registerUser, loginUser };
