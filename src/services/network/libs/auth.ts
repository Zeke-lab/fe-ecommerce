//  TODO: we will make related requests to server here!

import type { RegisterFormValues } from '../../../pages/auth/Register';
import { apiClient } from '../apiClient';
import { ApiConstantRoutes } from '../path';

// Login

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

export { registerUser };
