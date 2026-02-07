import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../apiClient';
import { ApiConstantRoutes } from '../path';
import type { CreateProductFormValues } from '@/components/products/CreateProductModal';

export interface Product {
  id: number;
  code?: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  qty?: number;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const useGetAllProducts = () => {
  return useQuery<Product[]>({
    queryKey: ['get-all-products'],
    queryFn: () => {
      return apiClient.get(ApiConstantRoutes.paths.products.default);
    },
  });
};

export const useGetProductById = (productId: number, enabled: boolean = true) => {
  return useQuery<Product>({
    queryKey: ['get-product-by-id', productId],
    queryFn: () => {
      return apiClient.get(`${ApiConstantRoutes.paths.products.default}/${productId}`);
    },
    enabled: enabled && productId > 0,
  });
};

export const createProduct = async (data: CreateProductFormValues) => {
  return apiClient.post(ApiConstantRoutes.paths.products.default, data);
};

export const deleteProduct = async (productId: number) => {
  return apiClient.delete(`${ApiConstantRoutes.paths.products.default}/${productId}`);
};

export const updateProduct = async (productId: number, data: Partial<CreateProductFormValues>): Promise<Product> => {
  return apiClient.patch(`${ApiConstantRoutes.paths.products.default}/${productId}`, data);
};
