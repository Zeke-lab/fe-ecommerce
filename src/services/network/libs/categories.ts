import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../apiClient';
import { ApiConstantRoutes } from '../path';
import type { CreateCategoryFormValues } from '@/components/category/CreateCategoryModal';

export interface Category {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const useGetAllCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['get-all-categories'],
    queryFn: () => {
      return apiClient.get(ApiConstantRoutes.paths.categories.default);
    },
  });
};

export const useGetCategoryById = (categoryId: number) => {
  return useQuery<Category>({
    queryKey: ['get-category-by-id', categoryId],
    queryFn: () => {
      return apiClient.get(`${ApiConstantRoutes.paths.categories.default}/${categoryId}`);
    }
  })
}

export const createCategory = async (data: CreateCategoryFormValues) => {
  return apiClient.post(ApiConstantRoutes.paths.categories.default, data)
}

export const deleteCategory = async (categoryId: number) => {
  return apiClient.delete(`${ApiConstantRoutes.paths.categories.default}/${categoryId}`)

}

export const updateCategory = async (categoryId: number, data: Partial<CreateCategoryFormValues>): Promise<Category> => {
  return apiClient.patch(`${ApiConstantRoutes.paths.categories.default}/${categoryId}`, data)
}