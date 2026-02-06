import { apiClient } from '../apiClient';
import { ApiConstantRoutes } from '../path';
import type { CreateProductFormValues } from '@/components/products/CreateProductModal';

export const createProduct = async (data: CreateProductFormValues) => {
  return apiClient.post(ApiConstantRoutes.paths.products.default, data);
};
