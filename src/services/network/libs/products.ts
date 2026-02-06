import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../apiClient';
import { ApiConstantRoutes } from '../path';
import type { CreateProductFormValues } from '@/components/products/CreateProductModal';

export interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: string;
  imageUrl?: string | null;
  categoryId?: number | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    name: string;
  } | null;
}

export const useGetAllProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['get-all-products'],
    queryFn: () =>
      apiClient.get(ApiConstantRoutes.paths.products.default),
  });
};

export const useGetProductById = (productId: number, enabled = true) => {
  return useQuery<Product>({
    queryKey: ['get-product-by-id', productId],
    queryFn: () =>
      apiClient.get(ApiConstantRoutes.paths.products.detail(productId)),
    enabled: enabled && productId > 0,
  });
};

export const createProduct = async (data: CreateProductFormValues) => {
  return apiClient.post(ApiConstantRoutes.paths.products.default, data);
};

export const updateProduct = async (
  productId: number,
  data: Partial<CreateProductFormValues>,
) => {
  return apiClient.put(
    ApiConstantRoutes.paths.products.detail(productId),
    data,
  );
};

export const deleteProduct = async (productId: number) => {
  return apiClient.delete(
    ApiConstantRoutes.paths.products.detail(productId),
  );
};
