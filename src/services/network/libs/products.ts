import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../apiClient';
import { ApiConstantRoutes } from '../path';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: string | number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
  } | null;
}

export interface CreateProductPayload {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId?: number;
}

export type UpdateProductPayload = Partial<CreateProductPayload>;

export const useGetAllProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['get-all-products'],
    queryFn: () => {
      return apiClient.get(ApiConstantRoutes.paths.products.default);
    },
  });
};

export const useGetProductById = (productId: number) => {
  return useQuery<Product>({
    queryKey: ['get-product-by-id', productId],
    queryFn: () => {
      return apiClient.get(
        `${ApiConstantRoutes.paths.products.default}/${productId}`,
      );
    },
    enabled: !!productId,
  });
};

export const createProduct = async (data: CreateProductPayload) => {
  return apiClient.post(ApiConstantRoutes.paths.products.default, data);
};

export const updateProduct = async (
  productId: number,
  data: UpdateProductPayload,
) => {
  return apiClient.patch(
    `${ApiConstantRoutes.paths.products.default}/${productId}`,
    data,
  );
};

export const deleteProduct = async (productId: number) => {
  return apiClient.delete(
    `${ApiConstantRoutes.paths.products.default}/${productId}`,
  );
};

